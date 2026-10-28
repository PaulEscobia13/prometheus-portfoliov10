import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import FAQItemModule from "../components/FAQItem.tsx";
import FooterRevealModule from "../components/FooterReveal.tsx";

const FAQItem = FAQItemModule.default ?? FAQItemModule;
const FooterReveal = FooterRevealModule.default ?? FooterRevealModule;

async function mount(t, children, { reduced = false, animate = true } = {}) {
  const dom = new JSDOM("<div id='root'></div>", { pretendToBeVisual: true });
  const saved = new Map();
  const install = (name, value) => {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  for (const name of ["window", "document", "HTMLElement"]) install(name, name === "window" ? dom.window : dom.window[name]);
  install("IS_REACT_ACT_ENVIRONMENT", true);
  const listeners = new Set();
  const media = { matches: reduced, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) };
  window.matchMedia = () => media;
  const frames = new Map();
  let id = 0;
  install("requestAnimationFrame", fn => { frames.set(++id, fn); return id; });
  install("cancelAnimationFrame", key => frames.delete(key));
  const observers = [];
  install("ResizeObserver", class {
    constructor(fn) { observers.push({ callback: fn, disconnected: false }); this.index = observers.length - 1; }
    observe() {}
    disconnect() { observers[this.index].disconnected = true; }
  });
  const animations = [];
  if (animate) window.HTMLElement.prototype.animate = function (keyframes, options) {
    const animation = { element: this, keyframes, options, cancelled: false, onfinish: null, cancel() { this.cancelled = true; } };
    animations.push(animation);
    return animation;
  };
  const layout = { mainBottom: 1000, footerTop: 400, answerHeight: 64 };
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    if (this.tagName === "MAIN") return { bottom: layout.mainBottom };
    if (this.tagName === "FOOTER") return { top: layout.footerTop };
    return { height: layout.answerHeight };
  };
  Object.defineProperty(window.HTMLElement.prototype, "scrollHeight", { get: () => 144 });
  Object.defineProperty(window.HTMLElement.prototype, "offsetHeight", { get: () => 400 });
  Object.defineProperty(window, "innerHeight", { value: 800 });
  Object.defineProperty(window, "scrollY", { value: 1000 });
  const scrolls = [];
  window.scrollTo = value => scrolls.push(value);
  const root = createRoot(document.querySelector("#root"));
  await act(async () => root.render(children));
  let unmounted = false;
  async function unmount() { if (!unmounted) { await act(async () => root.unmount()); unmounted = true; } }
  t.after(async () => {
    await unmount();
    dom.window.close();
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  return { media, listeners, animations, frames, observers, layout, scrolls, unmount,
    flush() { for (const [key, fn] of [...frames]) { frames.delete(key); fn(); } },
    changeMotion(value) { media.matches = value; for (const fn of listeners) fn(); },
  };
}

const faq = id => React.createElement(FAQItem, { id, question: `Question ${id}`, answer: "An answer that wraps onto multiple lines." });

test("FAQ rows open independently and rapid reversal continues from the current visible height", async t => {
  const env = await mount(t, React.createElement("div", null, faq("one"), faq("two")));
  const rows = [...document.querySelectorAll("details")];
  const click = async index => act(async () => rows[index].querySelector("summary").click());
  await click(0);
  assert.equal(rows[0].open, true);
  assert.deepEqual(env.animations[0].keyframes, [{ height: "0px" }, { height: "144px" }]);
  await click(1);
  assert.equal(rows[0].open && rows[1].open, true);
  env.layout.answerHeight = 52;
  await click(0);
  assert.equal(env.animations[0].cancelled, true);
  assert.equal(rows[0].open, true, "closing answer stays rendered until the animation ends");
  assert.deepEqual(env.animations[2].keyframes, [{ height: "52px" }, { height: "0px" }]);
  env.layout.answerHeight = 28;
  await click(0);
  env.animations[2].onfinish();
  assert.equal(rows[0].open, true, "an obsolete animation cannot close the reopened row");
  assert.deepEqual(env.animations[3].keyframes, [{ height: "28px" }, { height: "144px" }]);
  env.animations[3].onfinish();
  await click(0);
  env.animations[4].onfinish();
  assert.equal(rows[0].open, false);
  assert.equal(rows[1].open, true);
  await env.unmount();
  assert.equal(env.animations[1].cancelled, true);
  assert.equal(env.listeners.size, 0);
});

test("FAQ motion changes finish an in-flight close and reduced motion toggles instantly", async t => {
  const env = await mount(t, faq("motion"));
  const row = document.querySelector("details");
  const summary = row.querySelector("summary");
  await act(async () => summary.click());
  await act(async () => summary.click());
  env.changeMotion(true);
  assert.equal(row.open, false);
  assert.equal(env.animations[1].cancelled, true);
  await act(async () => summary.click());
  assert.equal(row.open, true);
  assert.equal(env.animations.length, 2);
});

test("FAQ remains operable when the browser has no animation API", async t => {
  const env = await mount(t, faq("fallback"), { animate: false });
  const row = document.querySelector("details");
  await act(async () => row.querySelector("summary").click());
  assert.equal(row.open, true);
  await act(async () => row.querySelector("summary").click());
  assert.equal(row.open, false);
  assert.equal(env.animations.length, 0);
});

test("footer reveal clamps at both ends, reverses, honors motion changes and cleans up", async t => {
  const env = await mount(t, React.createElement(React.Fragment, null,
    React.createElement("main"), React.createElement(FooterReveal, null, React.createElement("a", { href: "#faq" }, "FAQ"))));
  const footer = document.querySelector("footer");
  const offset = () => footer.style.getPropertyValue("--footer-reveal-offset");
  assert.equal(offset(), "40px");
  env.layout.mainBottom = 600;
  window.dispatchEvent(new window.Event("scroll"));
  window.dispatchEvent(new window.Event("scroll"));
  assert.equal(env.frames.size, 1);
  env.flush();
  assert.equal(offset(), "20px");
  env.layout.mainBottom = 400;
  window.dispatchEvent(new window.Event("scroll")); env.flush();
  assert.equal(offset(), "0px");
  env.layout.mainBottom = 1200;
  window.dispatchEvent(new window.Event("scroll")); env.flush();
  assert.equal(offset(), "40px");
  env.changeMotion(true); env.flush();
  assert.equal(offset(), "0px");
  env.changeMotion(false); env.flush();
  assert.equal(offset(), "40px");
  env.observers[0].callback();
  await env.unmount();
  assert.equal(env.frames.size, 0);
  assert.equal(env.observers[0].disconnected, true);
  assert.equal(env.listeners.size, 0);
  window.dispatchEvent(new window.Event("scroll"));
  assert.equal(env.frames.size, 0);
});

test("footer keyboard focus reveals covered links through the smooth-scroll integration", async t => {
  const env = await mount(t, React.createElement(React.Fragment, null,
    React.createElement("main"), React.createElement(FooterReveal, null, React.createElement("a", { href: "#faq" }, "FAQ"))));
  env.layout.mainBottom = 600;
  const link = document.querySelector("footer a");
  let target;
  const handled = event => { event.preventDefault(); target = event.detail; };
  window.addEventListener("prometheus:scroll-to", handled);
  link.focus();
  assert.equal(document.activeElement, link);
  assert.equal(target, 1200);
  assert.deepEqual(env.scrolls, []);
  window.removeEventListener("prometheus:scroll-to", handled);
  link.blur(); link.focus();
  assert.deepEqual(env.scrolls, [{ top: 1200, behavior: "instant" }]);
  env.layout.mainBottom = 400;
  link.blur(); link.focus();
  assert.equal(env.scrolls.length, 1, "a fully revealed footer does not move on focus");
});
