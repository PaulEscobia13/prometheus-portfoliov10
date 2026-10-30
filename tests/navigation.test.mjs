import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import NavigationModule from "../components/PrometheusNavigation.tsx";

const Navigation = NavigationModule.default ?? NavigationModule;

test("desktop and mobile menu retain section anchors, direct Services navigation, dismissal and focus return", async () => {
  const dom = new JSDOM("<div id='root'></div><main><section class='prometheus-faq'></section></main><footer id='contacts'></footer>", { pretendToBeVisual: true });
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
    const navbar = document.querySelector('.prometheus-navbar');
    navbar.getBoundingClientRect = () => ({bottom:100});
    let faqBottom = 1200;
    const faq = document.querySelector('.prometheus-faq');
    faq.style.borderBottomLeftRadius = '80px';
    faq.style.borderBottomRightRadius = '80px';
    faq.getBoundingClientRect = () => ({bottom:faqBottom});
    Object.defineProperty(document.documentElement, 'scrollHeight', {configurable:true,value:5000});
    Object.defineProperty(window, 'scrollY', {configurable:true,writable:true,value:1000});
    const scroll = async () => act(async()=>window.dispatchEvent(new window.Event('scroll')));
    await scroll();
    assert.equal(navbar.dataset.scrolled, 'true');
    assert.equal(navbar.dataset.footerVisible, 'false', 'FAQ content keeps the transparent navbar');
    faqBottom = 181;
    await scroll();
    assert.equal(navbar.dataset.footerVisible, 'false', 'transparent until rounded edge enters the navbar');
    faqBottom = 180;
    await scroll();
    assert.equal(navbar.dataset.footerVisible, 'true', 'black masks the start of the rounded corner');
    assert.equal(navbar.style.getPropertyValue('--footer-nav-burgundy'), '0%');
    faqBottom = 100;
    await scroll();
    assert.equal(navbar.style.getPropertyValue('--footer-nav-burgundy'), '0%', 'stays black until the entire edge passes');
    faqBottom = 20;
    window.scrollY = 5000 - window.innerHeight - 80;
    await scroll();
    assert.equal(navbar.style.getPropertyValue('--footer-nav-burgundy'), '50%', 'blend starts only after the FAQ clears');
    faqBottom = -60;
    window.scrollY = 5000 - window.innerHeight;
    await scroll();
    assert.equal(navbar.dataset.pageEnd, 'true');
    assert.equal(navbar.style.getPropertyValue('--footer-nav-burgundy'), '100%', 'fully burgundy at page bottom');
    faqBottom = 120;
    window.scrollY -= 180;
    await scroll();
    assert.equal(navbar.style.getPropertyValue('--footer-nav-burgundy'), '0%', 'returning to the rounded corner restores black');
    faqBottom = 181;
    await scroll();
    assert.equal(navbar.dataset.footerVisible, 'false', 'above the rounded corner restores transparency');
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
    assert.equal(document.querySelector(".nav-cta").textContent, "Contacts");
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
