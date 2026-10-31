import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import ShowcaseGalleryModule from "../components/ShowcaseGallery.tsx";
import { blankShowcaseSheets } from "../content/showcase.ts";

const ShowcaseGallery = ShowcaseGalleryModule.default ?? ShowcaseGalleryModule;

// JSDOM does not implement layout, media preferences, observers, pointer capture
// or WAAPI. These controlled boundaries exercise the real component's effects
// and event handlers; CSS projection and browser modality are verified manually.
async function mountGallery(t, { reduced = false, deferOpening = false } = {}) {
  const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { pretendToBeVisual: true, url: "http://localhost/prometheus" });
  const { window } = dom;
  const previousGlobals = new Map();
  const install = (name, value) => {
    previousGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  };
  for (const name of ["window", "document", "HTMLElement", "HTMLButtonElement", "HTMLDialogElement", "Node", "Event", "MouseEvent", "KeyboardEvent"]) install(name, name === "window" ? window : window[name]);
  install("IS_REACT_ACT_ENVIRONMENT", true);

  const mediaListeners = new Set();
  const visibilityListeners = new Set();
  const frames = new Map();
  const canceledFrames = [];
  const animations = [];
  const resizeObservers = [];
  const intersectionObservers = [];
  const capturedPointers = new Set();
  const layout = { viewport: 1440, pitch: 230, sheetWidth: 608, extent: 421 };
  let nextFrame = 0;
  let hidden = false;
  const media = {
    matches: reduced,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener(type, callback) { if (type === "change") mediaListeners.add(callback); },
    removeEventListener(type, callback) { if (type === "change") mediaListeners.delete(callback); },
  };
  install("matchMedia", query => {
    assert.equal(query, media.media);
    return media;
  });
  install("requestAnimationFrame", callback => { const id = ++nextFrame; frames.set(id, callback); return id; });
  install("cancelAnimationFrame", id => { canceledFrames.push(id); frames.delete(id); });
  Object.defineProperty(window.document, "hidden", { get: () => hidden });
  const addListener = window.document.addEventListener.bind(window.document);
  const removeListener = window.document.removeEventListener.bind(window.document);
  window.document.addEventListener = (type, callback, options) => {
    if (type === "visibilitychange") visibilityListeners.add(callback);
    addListener(type, callback, options);
  };
  window.document.removeEventListener = (type, callback, options) => {
    if (type === "visibilitychange") visibilityListeners.delete(callback);
    removeListener(type, callback, options);
  };

  class MockResizeObserver {
    constructor(callback) { this.callback = callback; this.disconnected = false; resizeObservers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  class MockIntersectionObserver {
    constructor(callback) { this.callback = callback; this.disconnected = false; intersectionObservers.push(this); }
    observe(target) { this.callback([{ target, isIntersecting: true }]); }
    disconnect() { this.disconnected = true; }
  }
  install("ResizeObserver", MockResizeObserver);
  install("IntersectionObserver", MockIntersectionObserver);
  install("DOMMatrix", class {
    constructor() { this.a = this.d = this.m11 = 1; this.b = this.c = this.m12 = this.m13 = 0; }
  });
  install("getComputedStyle", element => {
    const style = window.getComputedStyle(element);
    return { transform: style.transform || "none", getPropertyValue: property => property === "--showcase-active-scale" ? "1.025" : style.getPropertyValue(property) };
  });

  const rect = (left, width, height) => ({ left, top: 0, right: left + width, bottom: height, x: left, y: 0, width, height, toJSON() {} });
  const translation = element => Number(element.closest(".showcase-track")?.style.transform.match(/translate3d\(([-\d.]+)px/)?.[1] ?? 0);
  Object.defineProperty(window.HTMLElement.prototype, "clientWidth", { get() { return this.classList.contains("showcase-stage") ? layout.viewport : 0; } });
  Object.defineProperty(window.HTMLElement.prototype, "offsetWidth", { get() { return this.classList.contains("showcase-sheet") ? layout.sheetWidth : 1000; } });
  Object.defineProperty(window.HTMLElement.prototype, "offsetHeight", { get() { return this.classList.contains("showcase-sheet") ? 347 : 571; } });
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    if (this.classList.contains("showcase-slot")) return rect(Array.from(this.parentElement.children).indexOf(this) * layout.pitch + translation(this), layout.pitch, 480);
    if (this.classList.contains("showcase-sheet")) return rect(this.parentElement.getBoundingClientRect().left, this.dataset.lit === "true" ? layout.sheetWidth * 1.025 : layout.extent, 480);
    return rect(0, this.classList.contains("showcase-stage") ? layout.viewport : 1000, 571);
  };
  window.HTMLElement.prototype.setPointerCapture = id => capturedPointers.add(id);
  window.HTMLElement.prototype.hasPointerCapture = id => capturedPointers.has(id);
  window.HTMLElement.prototype.releasePointerCapture = id => capturedPointers.delete(id);
  window.HTMLElement.prototype.animate = function (keyframes, options) {
    let finish = () => {};
    const finished = deferOpening && options.duration === 650 ? new Promise(resolve => { finish = resolve; }) : Promise.resolve();
    const animation = { element: this, keyframes, options, canceled: false, finished, finish, cancel() { this.canceled = true; } };
    animations.push(animation);
    return animation;
  };
  window.HTMLElement.prototype.getAnimations = function () { return animations.filter(animation => animation.element === this && !animation.canceled); };
  window.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  window.HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };

  const root = createRoot(window.document.getElementById("root"));
  let unmounted = false;
  const unmount = async () => {
    if (unmounted) return;
    await act(async () => root.unmount());
    unmounted = true;
  };
  t.after(async () => {
    await unmount();
    dom.window.close();
    for (const [name, descriptor] of previousGlobals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  await act(async () => root.render(React.createElement(ShowcaseGallery, { sheets: blankShowcaseSheets })));
  const stage = window.document.querySelector(".showcase-stage");
  const track = window.document.querySelector(".showcase-track");
  const dialog = window.document.querySelector("dialog");
  const click = async element => { await act(async () => element.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }))); };
  const frame = async time => {
    const current = [...frames.values()];
    frames.clear();
    await act(async () => current.forEach(callback => callback(time)));
  };
  let pointerTime = 1000;
  const pointer = async (type, x, y = 0, id = 7, pointerType = "touch") => {
    const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperties(event, { timeStamp: { value: pointerTime += 16 }, pointerId: { value: id }, pointerType: { value: pointerType }, isPrimary: { value: true } });
    await act(async () => stage.dispatchEvent(event));
  };
  return {
    stage, track, dialog, mediaListeners, visibilityListeners, frames, canceledFrames, animations, resizeObservers, intersectionObservers, capturedPointers,
    click, frame, pointer, unmount, layout,
    async focus(element) { await act(async () => element.focus()); },
    async resize(dimensions) { await act(async () => { Object.assign(layout, dimensions); for (const observer of resizeObservers.filter(item => !item.disconnected)) observer.callback([]); }); },
    async preference(matches) { await act(async () => { media.matches = matches; for (const listener of [...mediaListeners]) listener({ matches }); }); },
    async visibility(value) { await act(async () => { hidden = value; window.document.dispatchEvent(new window.Event("visibilitychange")); }); },
    async key(key) { await act(async () => stage.dispatchEvent(new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }))); },
  };
}

test("initial reduced motion disables autoplay and WAAPI while keeping keyboard previews usable", async t => {
  const gallery = await mountGallery(t, { reduced: true });
  assert.equal(gallery.frames.size, 0);
  assert.equal(document.querySelector(".showcase-toolbar"), null);
  await gallery.key("ArrowRight");
  assert.match(document.querySelector('[role="status"]').textContent, /Hardware/);
  await gallery.key("Enter");
  assert.ok(gallery.dialog.open);
  assert.equal(document.querySelector("#showcase-preview-title").textContent, "Hardware");
  assert.equal(document.activeElement.getAttribute("aria-label"), "Close preview");
  assert.equal(document.documentElement.style.overflow, "hidden");
  assert.equal(gallery.animations.length, 0);
  await gallery.click(document.querySelector(".showcase-preview-close"));
  assert.equal(gallery.dialog.open, false);
  assert.equal(document.documentElement.style.overflow, "");
  assert.equal(gallery.animations.length, 0);
  assert.equal(gallery.frames.size, 0);
});

test("live reduced-motion changes cancel the active frame and resume only after motion is allowed", async t => {
  const gallery = await mountGallery(t);
  assert.equal(gallery.frames.size, 1);
  await gallery.frame(1000);
  const initial = gallery.track.style.transform;
  await gallery.frame(1050);
  assert.notEqual(gallery.track.style.transform, initial);
  await gallery.preference(true);
  assert.equal(gallery.frames.size, 0);
  assert.ok(gallery.canceledFrames.length > 0);
  const stopped = gallery.track.style.transform;
  await gallery.frame(1100);
  assert.equal(gallery.track.style.transform, stopped);
  await gallery.preference(false);
  assert.equal(gallery.frames.size, 1);
  await gallery.frame(1200);
  await gallery.frame(1250);
  assert.notEqual(gallery.track.style.transform, stopped);
  assert.equal(gallery.mediaListeners.size, 1, "preference changes do not accumulate subscriptions");
});

test("switching to reduced motion cancels an expanded preview animation without closing it", async t => {
  const gallery = await mountGallery(t);
  await gallery.key("Enter");
  assert.ok(gallery.dialog.open);
  assert.equal(gallery.animations.length, 1);
  await gallery.preference(true);
  assert.ok(gallery.animations[0].canceled);
  assert.ok(gallery.dialog.open);
  assert.equal(gallery.animations.length, 1, "reduced motion does not start a replacement animation");
  assert.equal(gallery.frames.size, 0);
  await gallery.click(document.querySelector(".showcase-preview-close"));
  assert.equal(gallery.dialog.open, false);
  assert.equal(gallery.animations.length, 1, "closing also bypasses WAAPI");
});

test("pointer cancellation and lost capture end dragging and allow a subsequent drag", async t => {
  const gallery = await mountGallery(t, { reduced: true });
  await gallery.pointer("pointerdown", 100, 30);
  await gallery.pointer("pointermove", 140, 32);
  assert.equal(gallery.stage.dataset.dragging, "true");
  const dragged = gallery.track.style.transform;
  await gallery.pointer("pointercancel", 140, 32);
  // Browsers implicitly release capture after pointercancel.
  gallery.capturedPointers.delete(7);
  await gallery.pointer("lostpointercapture", 140, 32);
  assert.equal(gallery.stage.dataset.dragging, "false");
  assert.equal(gallery.stage.dataset.active, "");
  await gallery.pointer("pointermove", 240, 32);
  assert.equal(gallery.track.style.transform, dragged, "the canceled pointer no longer moves the track");
  await gallery.pointer("pointerdown", 240, 32, 8);
  await gallery.pointer("pointermove", 290, 34, 8);
  assert.equal(gallery.stage.dataset.dragging, "true");
  assert.notEqual(gallery.track.style.transform, dragged);
  await gallery.pointer("pointerup", 290, 34, 8);
  assert.equal(gallery.stage.dataset.dragging, "false");
  assert.equal(gallery.capturedPointers.size, 0);
});

test("a hidden document stops autoplay and unmount removes observers, frames and listeners", async t => {
  const gallery = await mountGallery(t);
  await gallery.frame(1000);
  await gallery.frame(1050);
  const visible = gallery.track.style.transform;
  await gallery.visibility(true);
  assert.equal(gallery.frames.size, 0);
  await gallery.frame(1100);
  assert.equal(gallery.track.style.transform, visible);
  await gallery.visibility(false);
  assert.equal(gallery.frames.size, 1);
  await gallery.unmount();
  assert.equal(gallery.frames.size, 0);
  assert.equal(gallery.mediaListeners.size, 0);
  assert.equal(gallery.visibilityListeners.size, 0);
  assert.ok(gallery.resizeObservers.every(observer => observer.disconnected));
  assert.ok(gallery.intersectionObservers.every(observer => observer.disconnected));
});

test("unmounting an expanded preview cancels its animation and restores page scrolling", async t => {
  const gallery = await mountGallery(t);
  document.documentElement.style.overflow = "scroll";
  await gallery.key("Enter");
  assert.equal(document.documentElement.style.overflow, "hidden");
  assert.equal(gallery.animations.length, 1);
  await gallery.unmount();
  assert.ok(gallery.animations.every(animation => animation.canceled));
  assert.equal(document.documentElement.style.overflow, "scroll");
  assert.equal(gallery.mediaListeners.size, 0);
  assert.equal(gallery.visibilityListeners.size, 0);
  assert.equal(gallery.frames.size, 0);
});

test("Space pauses motion without a visible toolbar and arrow keys wrap concepts", async t => {
  const gallery = await mountGallery(t);
  assert.equal(document.querySelector(".showcase-toolbar"), null);
  assert.equal(document.querySelector('[aria-label="Previous concept"]'), null);
  await gallery.frame(1000); await gallery.frame(1050);
  await gallery.key(" ");
  assert.equal(document.querySelector('[role="status"]').textContent, "Gallery motion paused.");
  for (let time = 1100; gallery.frames.size && time < 6000; time += 50) await gallery.frame(time);
  assert.equal(gallery.frames.size, 0);
  const paused = gallery.track.style.transform;
  await gallery.key(" "); await gallery.frame(7000); await gallery.frame(7050);
  assert.notEqual(gallery.track.style.transform, paused);
  await gallery.key("ArrowLeft");
  assert.equal(document.querySelector('[role="status"]').textContent, "Wedding RSVP, 14 of 14.");
  await gallery.key("ArrowRight");
  assert.equal(document.querySelector('[role="status"]').textContent, "Nail Salon, 1 of 14.");
});

test("a flick coasts in its release direction and normal capture release preserves momentum", async t => {
  const gallery = await mountGallery(t);
  await gallery.pointer("pointerdown", 300);
  await gallery.pointer("pointermove", 260);
  await gallery.pointer("pointermove", 200);
  const released = gallery.track.style.transform;
  await gallery.pointer("pointerup", 200);
  await gallery.pointer("lostpointercapture", 200);
  await gallery.frame(1000); await gallery.frame(1050);
  const x = value => Number(value.match(/translate3d\(([-\d.]+)px/)[1]);
  assert.ok(x(gallery.track.style.transform) < x(released), "leftward momentum continues after release");
  await gallery.preference(true);
  const stopped = gallery.track.style.transform;
  await gallery.frame(1100);
  assert.equal(gallery.track.style.transform, stopped);
});

test("resizing keeps the keyboard-selected card centered", async t => {
  const gallery = await mountGallery(t, { reduced: true });
  const assertCentered = id => {
    const centers = [...document.querySelectorAll(`[data-sheet-id="${id}"]`)].map(element => {
      const bounds = element.getBoundingClientRect();
      return Math.abs(bounds.left + bounds.width / 2 - gallery.layout.viewport / 2);
    });
    assert.ok(Math.min(...centers) < 1e-6, `${id} is centered in the resized viewport`);
    assert.equal(gallery.stage.dataset.active, id);
  };
  await gallery.focus(gallery.stage);
  for (let index = 0; index < 7; index++) await gallery.key("ArrowRight");
  assertCentered("sheet-08");
  await gallery.resize({ viewport: 375, pitch: 170, sheetWidth: 400, extent: 300 });
  assertCentered("sheet-08");
  assert.equal(document.activeElement, gallery.stage);
  await gallery.key("ArrowRight");
  assertCentered("sheet-09");
  await gallery.resize({ viewport: 1920, pitch: 310, sheetWidth: 800, extent: 500 });
  assertCentered("sheet-09");
  assert.equal(document.activeElement, gallery.stage);
  assert.equal(document.querySelector('[role="status"]').textContent, "Lendfolio, 9 of 14.");
});

test("hovering either edge does not steer or start gallery motion", async t => {
  const gallery = await mountGallery(t, { reduced: true });
  const initial = gallery.track.style.transform;
  await gallery.pointer("pointermove", 10, 30, 1, "mouse");
  await gallery.frame(1000);
  assert.equal(gallery.track.style.transform, initial);
  await gallery.pointer("pointermove", 1430, 30, 1, "mouse");
  await gallery.frame(1050);
  assert.equal(gallery.track.style.transform, initial);
  assert.equal(gallery.frames.size, 0);
});

test("preview close control waits for the image entrance and caption stays hidden", async t => {
  const gallery = await mountGallery(t, { deferOpening: true });
  await gallery.key("Enter");
  const frame = document.querySelector(".showcase-preview-frame");
  const close = document.querySelector(".showcase-preview-close");
  assert.equal(frame.dataset.ready, "false");
  assert.equal(close.disabled, true);
  assert.equal(document.activeElement, gallery.dialog);
  assert.equal(document.querySelector(".showcase-preview-caption"), null);
  await act(async () => gallery.animations[0].finish());
  assert.equal(frame.dataset.ready, "true");
  assert.equal(close.disabled, false);
  assert.equal(document.activeElement, close);
  await gallery.click(close);
  assert.equal(gallery.dialog.open, false);
});

test("Escape can dismiss the preview before its delayed controls appear", async t => {
  const gallery = await mountGallery(t, { deferOpening: true });
  await gallery.key("Enter");
  await act(async () => gallery.dialog.dispatchEvent(new window.Event("cancel", { cancelable: true })));
  assert.equal(gallery.dialog.open, false);
  await act(async () => gallery.animations[0].finish());
  assert.equal(gallery.dialog.open, false);
  assert.equal(document.querySelector(".showcase-preview-close"), null);
});

test("wheel gestures glide, reverse promptly and preserve vertical page scrolling and pinch zoom", async t => {
  const gallery = await mountGallery(t);
  const wheel = async options => {
    const event = new window.WheelEvent("wheel", { bubbles: true, cancelable: true, ...options });
    await act(async () => gallery.stage.dispatchEvent(event));
    return event;
  };
  const x = () => Number(gallery.track.style.transform.match(/translate3d\(([-\d.]+)px/)[1]);
  await gallery.frame(1000);
  const before = x();
  assert.equal((await wheel({ deltaX: 120 })).defaultPrevented, true);
  assert.equal(x(), before, "wheel input eases through frames instead of jumping");
  await gallery.frame(1050); await gallery.frame(1100);
  assert.ok(x() < before, "scrolling right moves cards left");
  const reversed = x();
  await wheel({ deltaX: -120 });
  await gallery.frame(1150);
  assert.ok(x() > reversed, "opposite input reverses on the next frame");
  assert.equal((await wheel({ deltaY: 90 })).defaultPrevented, false, "vertical page scrolling remains native");
  assert.equal((await wheel({ deltaY: 90, ctrlKey: true })).defaultPrevented, false, "pinch zoom remains native");
  await gallery.preference(true);
  const still = x();
  await wheel({ deltaX: 40 });
  assert.notEqual(x(), still, "reduced motion supports direct manual browsing");
  assert.equal(gallery.frames.size, 0, "reduced motion has no coasting frames");
});
