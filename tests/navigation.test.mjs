import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import NavigationModule from "../components/PrometheusNavigation.tsx";

const Navigation = NavigationModule.default ?? NavigationModule;

test("desktop and mobile menu retain section anchors, direct Services navigation, dismissal and focus return", async () => {
  const dom = new JSDOM("<div id='root'></div>", { pretendToBeVisual: true });
  const saved = new Map();
  const install = (name, value) => {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  install("window", dom.window);
  install("document", dom.window.document);
  install("IS_REACT_ACT_ENVIRONMENT", true);
  const listeners = new Set();
  const query = { matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) };
  window.matchMedia = () => query;
  dom.window.HTMLElement.prototype.getClientRects = () => [{}];
  const root = createRoot(document.querySelector("#root"));
  try {
    await act(async () => root.render(React.createElement(Navigation)));
    const menu = document.querySelector("#prometheus-menu");
    const toggle = document.querySelector(".prometheus-menu-toggle");
    const click = async el => act(async () => el.click());
    const open = async () => click(toggle);
    assert.equal(menu.hasAttribute("inert"), false, "desktop section links are always keyboard accessible");
    await open();
    assert.equal(toggle.getAttribute("aria-expanded"), "true");
    assert.equal(menu.hasAttribute("inert"), false);
    assert.equal(document.activeElement.getAttribute("href"), "#services");
    assert.equal(document.querySelector(".prometheus-services-toggle"), null);
    assert.equal(document.querySelector("#prometheus-services-submenu"), null);
    await click(menu.querySelector('a[href="#services"]'));
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    for (const target of ["#services", "#works", "#pricing"]) {
      await open();
      const link = menu.querySelector(`a[href="${target}"]`);
      assert.ok(link, `preserves ${target} scroll target`);
      await click(link);
      assert.equal(toggle.getAttribute("aria-expanded"), "false");
    }
    await open();
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(document.activeElement, toggle);
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    await open();
    await act(async () => document.body.dispatchEvent(new window.MouseEvent("pointerdown", { bubbles: true })));
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    await open();
    query.matches = true;
    await act(async () => { for (const fn of listeners) fn(); });
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
    assert.equal(menu.hasAttribute("inert"), true, "closed mobile menu cannot receive focus");
    await open();
    assert.equal(menu.hasAttribute("inert"), false, "mobile uses the same operable menu");
    assert.equal(document.querySelector(".nav-cta").textContent, "Contact Us");
    assert.equal(document.querySelector(".nav-cta").getAttribute("href"), "#contacts");
    await act(async () => root.unmount());
    assert.equal(listeners.size, 0);
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
