import assert from 'node:assert/strict';
import test from 'node:test';
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
import CaseStudiesModule from '../components/CaseStudies.tsx';
import {caseStudies} from '../content/caseStudies.ts';
const CaseStudies = CaseStudiesModule.default ?? CaseStudiesModule;
const cases = caseStudies.map(item=>({...item,screenshots:['/cases/one.png','/cases/two.png']}));

test('main-style panel transitions remain animated while fitting laptop viewports and keeping mobile copy stable', async () => {
  const dom = new JSDOM('<nav class="prometheus-navbar"></nav><div id="root"></div>', {pretendToBeVisual:true,url:'http://localhost'});
  const saved = new Map();
  const install=(name,value)=>{saved.set(name,Object.getOwnPropertyDescriptor(globalThis,name));Object.defineProperty(globalThis,name,{configurable:true,writable:true,value});};
  install('window',dom.window);install('document',dom.window.document);install('IS_REACT_ACT_ENVIRONMENT',true);
  install('requestAnimationFrame',window.requestAnimationFrame.bind(window));install('cancelAnimationFrame',window.cancelAnimationFrame.bind(window));
  let resize, disconnected=false, panelHeight=600, galleryTop=150;
  const animations=[];
  install('ResizeObserver',class {constructor(fn){resize=fn;}observe(){}disconnect(){disconnected=true;}});
  window.matchMedia=()=>({matches:false});
  Object.defineProperty(window,'innerHeight',{configurable:true,value:650,writable:true});
  Object.defineProperty(window,'innerWidth',{configurable:true,value:1280,writable:true});
  Object.defineProperty(window.HTMLElement.prototype,'offsetHeight',{configurable:true,get(){return panelHeight;}});
  window.HTMLElement.prototype.getBoundingClientRect=function(){
    if(this.classList.contains('prometheus-navbar'))return {bottom:109};
    const index=Number(this.id?.match(/-image-(\d+)$/)?.[1]??0);
    return {top:galleryTop+index*600,height:580};
  };
  window.HTMLElement.prototype.animate=function(keyframes,options){animations.push({keyframes,options});return {cancel(){}};};
  const root=createRoot(document.querySelector('#root'));
  const settle=async()=>act(async()=>{await new Promise(resolve=>setTimeout(resolve,230));});
  try {
    await act(async()=>root.render(React.createElement(CaseStudies,{cases})));
    assert.equal(document.querySelectorAll('.prometheus-case-layout').length,2,'one changing panel per project, without segmented stories');
    const article=document.querySelector('#case-furniture-odyssey');
    assert.equal(article.dataset.manual,'false');
    const scale=Number(article.style.getPropertyValue('--case-copy-scale'));
    assert.ok(scale<1 && scale>=.78);
    assert.equal(Number.parseFloat(article.style.getPropertyValue('--case-copy-height')),497,'entire panel fits below measured navbar');
    const quote=()=>article.querySelector('blockquote').textContent.replace(/\u2005/g,' ');
    assert.equal(quote(),cases[0].story[0].quote);
    galleryTop=-471;
    await act(async()=>window.dispatchEvent(new window.Event('scroll')));
    await settle();await settle();
    assert.equal(quote(),cases[0].story[1].quote,'scroll switches the existing panel to the next story');
    assert.ok(animations.some(a=>a.options.duration===160),'retains main fade-out');
    assert.ok(animations.some(a=>a.options.duration===440),'retains main slide/fade entrance');
    window.innerWidth=390;
    await act(async()=>window.dispatchEvent(new window.Event('resize')));
    assert.equal(article.dataset.manual,'true');
    galleryTop=-1671;
    await act(async()=>window.dispatchEvent(new window.Event('scroll')));
    await settle();
    assert.equal(quote(),cases[0].story[1].quote,'mobile scrolling does not replace unread copy');
    await act(async()=>article.querySelector('[aria-label="Next project image"]').click());
    await settle();await settle();
    assert.equal(quote(),cases[0].story[2].quote,'mobile arrows use the same changing panel');
    assert.equal(article.querySelectorAll('figure[data-selected="true"]').length,1);
    window.innerWidth=1280;panelHeight=900;
    await act(async()=>resize());
    assert.equal(article.dataset.manual,'true','too-tall copy remains full size and explicitly controlled');
    await act(async()=>root.unmount());assert.equal(disconnected,true);
  } finally {
    await act(async()=>root.unmount());dom.window.close();
    for(const [name,value]of saved){if(value)Object.defineProperty(globalThis,name,value);else delete globalThis[name];}
  }
});
