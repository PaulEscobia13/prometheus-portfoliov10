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
async function mountGallery(t, { reduced = false } = {}) {
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
    const animation = { element: this, keyframes, options, canceled: false, finished: Promise.resolve(), cancel() { this.canceled = true; } };
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
  const pointer = async (type, x, y = 0, id = 7) => {
    const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperties(event, { pointerId: { value: id }, pointerType: { value: "touch" }, isPrimary: { value: true } });
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
  const motionControl = [...document.querySelectorAll("button")].find(button => button.textContent === "Motion reduced");
  assert.ok(motionControl?.disabled);
  await gallery.key("ArrowRight");
  assert.match(document.querySelector('[role="status"]').textContent, /Concept 02/);
  await gallery.key("Enter");
  assert.ok(gallery.dialog.open);
  assert.equal(document.querySelector("#showcase-preview-title").textContent, "Concept 02");
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
  await gallery.click(document.querySelector(".showcase-preview-trigger"));
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
  await gallery.click(document.querySelector(".showcase-preview-trigger"));
  assert.equal(document.documentElement.style.overflow, "hidden");
  assert.equal(gallery.animations.length, 1);
  await gallery.unmount();
  assert.ok(gallery.animations.every(animation => animation.canceled));
  assert.equal(document.documentElement.style.overflow, "scroll");
  assert.equal(gallery.mediaListeners.size, 0);
  assert.equal(gallery.visibilityListeners.size, 0);
  assert.equal(gallery.frames.size, 0);
});

test("Play resumes movement while the native motion button retains keyboard focus", async t => {
  const gallery = await mountGallery(t);
  const control = [...document.querySelectorAll("button")].find(button => button.textContent === "Pause motion");
  await gallery.frame(1000);
  await gallery.frame(1050);
  await gallery.focus(control);
  await gallery.click(control);
  assert.equal(document.activeElement, control);
  assert.equal(control.textContent, "Play motion");
  assert.equal(control.getAttribute("aria-pressed"), "true");
  for (let time = 1100; gallery.frames.size && time < 6000; time += 50) await gallery.frame(time);
  assert.equal(gallery.frames.size, 0, "pause settles without keeping an idle animation frame alive");
  const paused = gallery.track.style.transform;
  await gallery.click(control);
  assert.equal(control.textContent, "Pause motion");
  assert.equal(control.getAttribute("aria-pressed"), "false");
  assert.equal(document.activeElement, control, "playing does not move keyboard focus away from its control");
  await gallery.frame(7000);
  await gallery.frame(7050);
  assert.notEqual(gallery.track.style.transform, paused, "the focused motion control does not block autoplay");
});

test("Previous and Next wrap accessibly and announce the concept without stage-only instructions", async t => {
  const gallery = await mountGallery(t, { reduced: true });
  const previous = document.querySelector('[aria-label="Previous concept"]');
  const next = document.querySelector('[aria-label="Next concept"]');
  const status = document.querySelector('[role="status"]');
  await gallery.focus(previous);
  await gallery.click(previous);
  assert.equal(status.textContent, "Concept 12, 12 of 12.");
  assert.equal(document.querySelector(".showcase-preview-trigger").getAttribute("aria-label"), "Preview Concept 12, 12 of 12");
  assert.equal(document.activeElement, previous);
  await gallery.focus(next);
  await gallery.click(next);
  assert.equal(status.textContent, "Concept 01, 1 of 12.");
  assert.equal(document.querySelector(".showcase-preview-trigger").getAttribute("aria-label"), "Preview Concept 01, 1 of 12");
  assert.equal(document.activeElement, next);
  assert.equal(document.querySelector(".showcase-controls").getAttribute("aria-label"), "Browse all 12 concepts");
  assert.equal(gallery.dialog.open, false);
});

test("resizing keeps the selected card centered while stage or browse controls retain focus", async t => {
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
  const next = document.querySelector('[aria-label="Next concept"]');
  await gallery.focus(next);
  await gallery.click(next);
  assertCentered("sheet-09");
  await gallery.resize({ viewport: 1920, pitch: 310, sheetWidth: 800, extent: 500 });
  assertCentered("sheet-09");
  assert.equal(document.activeElement, next);
  assert.equal(document.querySelector('[role="status"]').textContent, "Concept 09, 9 of 12.");
});
