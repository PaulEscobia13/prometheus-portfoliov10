import assert from 'node:assert/strict';
import test from 'node:test';
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import CaseStudiesModule from '../components/CaseStudies.tsx';
import {caseStudies} from '../content/caseStudies.ts';
const CaseStudies = CaseStudiesModule.default ?? CaseStudiesModule;

test('all case stories remain readable and sticky is allowed only when the complete panel fits', async () => {
  const dom = new JSDOM('<nav class="prometheus-navbar"></nav><div id="root"></div>', {pretendToBeVisual:true,url:'http://localhost'});
  const saved = new Map();
  const install = (name,value) => {saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});};
  install('window',dom.window);install('document',dom.window.document);install('IS_REACT_ACT_ENVIRONMENT',true);
  let resize, disconnected=false, panelHeight=700;
  install('ResizeObserver',class {constructor(fn){resize=fn;}observe(){}disconnect(){disconnected=true;}});
  Object.defineProperty(window,'innerHeight',{configurable:true,value:650,writable:true});
  document.querySelector('nav').getBoundingClientRect=()=>({bottom:109});
  Object.defineProperty(window.HTMLElement.prototype,'offsetHeight',{configurable:true,get(){return panelHeight;}});
  const root=createRoot(document.querySelector('#root'));
  try {
    await act(async()=>root.render(React.createElement(CaseStudies,{cases:caseStudies})));
    assert.equal(document.querySelectorAll('.prometheus-case-layout').length,7);
    for(const item of caseStudies) for(const [index,story] of item.story.entries()) {
      const panel=document.getElementById(`case-${item.id}-image-${index}`);
      assert.ok(panel);
      assert.equal(panel.querySelector('blockquote').textContent.replace(/\u2005/g,' '),story.quote);
      assert.ok(panel.querySelector('.prometheus-case-gallery img'),'each story has paired artwork');
    }
    assert.equal(document.querySelector('#works').style.getPropertyValue('--case-nav-offset'),'129px');
    assert.ok([...document.querySelectorAll('.prometheus-case-details')].every(p=>p.dataset.fits==='false'),'long panels scroll naturally on short laptop screens');
    const before=[...document.querySelectorAll('blockquote')].map(p=>p.textContent);
    await act(async()=>window.dispatchEvent(new window.Event('scroll')));
    assert.deepEqual([...document.querySelectorAll('blockquote')].map(p=>p.textContent),before,'scroll cannot replace partially read paragraphs');
    panelHeight=300;
    await act(async()=>resize());
    assert.ok([...document.querySelectorAll('.prometheus-case-details')].every(p=>p.dataset.fits==='true'),'complete panels can stick when enough room exists');
    window.innerHeight=390;
    await act(async()=>window.dispatchEvent(new window.Event('resize')));
    assert.ok([...document.querySelectorAll('.prometheus-case-details')].every(p=>p.dataset.fits==='false'),'landscape viewport falls back to normal flow');
    for(const link of document.querySelectorAll('.prometheus-case-control-buttons a')) assert.ok(document.querySelector(link.getAttribute('href')),'navigation points to existing story rows');
    await act(async()=>root.unmount());
    assert.equal(disconnected,true);
  } finally {
    await act(async()=>root.unmount());dom.window.close();
    for(const [name,value] of saved){if(value)Object.defineProperty(globalThis,name,value);else delete globalThis[name];}
  }
});
