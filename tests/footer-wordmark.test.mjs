import assert from "node:assert/strict";
import test from "node:test";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import FooterWordmarkModule from "../components/FooterWordmark.tsx";
const FooterWordmark = FooterWordmarkModule.default ?? FooterWordmarkModule;

test("footer cycles decoded artwork only while visible and stops for reduced motion and cleanup", async t => {
  const dom = new JSDOM('<div id="root"></div>');
  const saved = new Map();
  const install = (name, value) => { saved.set(name, Object.getOwnPropertyDescriptor(globalThis,name)); Object.defineProperty(globalThis,name,{configurable:true,writable:true,value}); };
  install('window', dom.window); install('document', dom.window.document); install('IS_REACT_ACT_ENVIRONMENT', true);
  let observe;
  let disconnected = false;
  install('IntersectionObserver', class { constructor(callback){ observe=callback; } observe(){} disconnect(){ disconnected=true; } });
  const mediaListeners = new Set();
  const media = {matches:false,addEventListener:(_,f)=>mediaListeners.add(f),removeEventListener:(_,f)=>mediaListeners.delete(f)};
  window.matchMedia = () => media;
  Object.defineProperty(document,'hidden',{configurable:true,value:false});
  const requested=[];
  window.Image=class { set src(value){requested.push(value); queueMicrotask(()=>this.onload?.());} decode(){return Promise.resolve();} };
  t.mock.timers.enable({apis:['setTimeout']});
  const root=createRoot(document.querySelector('#root'));
  const advance=async ms=>act(async()=>{t.mock.timers.tick(ms);});
  try {
    await act(async()=>root.render(React.createElement(FooterWordmark,{images:['/showcase/one.webp','/showcase/two.webp']})));
    await advance(5000);
    assert.deepEqual(requested,[], 'no offscreen artwork downloads');
    await act(async()=>observe([{isIntersecting:true}]));
    await advance(600);
    assert.deepEqual(requested,['/showcase/one.webp']);
    assert.match(document.querySelector('[data-active="true"]').style.backgroundImage,/one.webp/);
    await advance(4500);
    assert.deepEqual(requested,['/showcase/one.webp','/showcase/two.webp']);
    assert.match(document.querySelector('[data-active="true"]').style.backgroundImage,/two.webp/);
    await act(async()=>observe([{isIntersecting:false}]));
    await advance(9000);
    assert.equal(requested.length,2);
    await act(async()=>{media.matches=true; for(const fn of mediaListeners) fn(); observe([{isIntersecting:true}]);});
    assert.equal(document.querySelector('[data-active="true"]'),null);
    await advance(9000);
    assert.equal(requested.length,2);
    await act(async()=>{media.matches=false;for(const fn of mediaListeners) fn();});
    await advance(600);
    assert.equal(requested.length,3);
    await act(async()=>root.unmount());
    await advance(9000);
    assert.equal(requested.length,3);
    assert.equal(disconnected,true);
    assert.equal(mediaListeners.size,0);
  } finally {
    await act(async()=>root.unmount());
    t.mock.timers.reset();
    dom.window.close();
    for(const [key,value] of saved){if(value) Object.defineProperty(globalThis,key,value);else delete globalThis[key];}
  }
});
