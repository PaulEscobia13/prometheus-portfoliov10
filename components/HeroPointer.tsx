"use client";

import { useEffect } from "react";
import { elasticOut, springStep } from "../lib/pointer-motion";

const targets = ".prometheus-hero-title, .home-section-hero .button-primary, .prometheus-navbar .nav-cta, .prometheus-footer-cta";
type Magnet = { x: number; y: number; fromX: number; fromY: number; elapsed: number; aimX: number; aimY: number };

export default function HeroPointer() {
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const badge = document.createElement("span");
    badge.className = "prometheus-logo-cursor";
    badge.setAttribute("aria-hidden", "true");
    const face = document.createElement("span");
    face.className = "prometheus-logo-cursor-face";
    const logo = document.createElement("img");
    logo.src = "/favicons/prometheus-cursor.png";
    logo.alt = "";
    face.append(logo);
    badge.append(face);
    document.body.append(badge);
    const magnets = new Map<HTMLElement, Magnet>();
    let active: HTMLElement | null = null;
    let frame: number | undefined;
    let x = 0, y = 0, pointerX = 0, pointerY = 0;
    let positioned = false;
    let vx = 0, vy = 0, scale = .1, scaleVelocity = 0;
    let lastTime: number | undefined;

    function paint(time = 0) {
      frame = undefined;
      const elapsed = lastTime === undefined ? 1000 / 60 : Math.max(1, Math.min(32, time - lastTime));
      lastTime = time;
      const seconds = elapsed / 1000;
      const horizontal = springStep(x, vx, pointerX, seconds, 350, 18, .3);
      const vertical = springStep(y, vy, pointerY, seconds, 350, 18, .3);
      x = horizontal.position; vx = horizontal.velocity;
      y = vertical.position; vy = vertical.velocity;
      const growth = springStep(scale, scaleVelocity, active ? 1 : .1, seconds, 200, 20);
      scale = growth.position; scaleVelocity = growth.velocity;
      face.style.transform = `scale(${scale})`;
      if (positioned) badge.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      let settling = positioned && (Math.abs(pointerX - x) + Math.abs(pointerY - y) + Math.abs(vx) + Math.abs(vy) > .1 || Math.abs((active ? 1 : .1) - scale) + Math.abs(scaleVelocity) > .001);
      for (const [element, tween] of magnets) {
        tween.elapsed = Math.min(1, tween.elapsed + seconds);
        const eased = elasticOut(tween.elapsed);
        tween.x = tween.fromX + (tween.aimX - tween.fromX) * eased;
        tween.y = tween.fromY + (tween.aimY - tween.fromY) * eased;
        if (tween.elapsed >= 1 && element !== active) {
          element.style.removeProperty("translate");
          magnets.delete(element);
        } else {
          element.style.translate = `${tween.x}px ${tween.y}px`;
          if (tween.elapsed < 1) settling = true;
        }
      }
      if (settling) frame = requestAnimationFrame(paint);
      else lastTime = undefined;
    }
    function schedule() { if (frame === undefined) frame = requestAnimationFrame(paint); }
    function reset() {
      active = null;
      badge.removeAttribute("data-visible");
      for (const tween of magnets.values()) {
        tween.fromX = tween.x; tween.fromY = tween.y; tween.elapsed = 0;
        tween.aimX = tween.aimY = 0;
      }
      if (positioned || magnets.size) schedule();
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== "mouse") { reset(); return; }
      const next = event.target instanceof Element ? event.target.closest<HTMLElement>(targets) : null;
      if (next !== active) { reset(); active = next; }
      pointerX = event.clientX; pointerY = event.clientY;
      if (!positioned && active) { x = pointerX; y = pointerY; positioned = true; }
      if (active) {
        badge.dataset.visible = "true";
        const isButton = active.matches("a");
        badge.dataset.cta = String(isButton);
        if (isButton) {
          const spring = magnets.get(active) ?? { x: 0, y: 0, fromX: 0, fromY: 0, elapsed: 0, aimX: 0, aimY: 0 };
          magnets.set(active, spring);
          const rect = active.getBoundingClientRect();
          spring.fromX = spring.x; spring.fromY = spring.y; spring.elapsed = 0;
          spring.aimX = (pointerX - (rect.left + rect.width / 2)) * .35;
          spring.aimY = (pointerY - (rect.top + rect.height / 2)) * .35;
        }
      }
      if (positioned || magnets.size) schedule();
    }
    function configure() {
      if (media.matches) return;
      reset();
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      lastTime = undefined;
      positioned = false;
      vx = vy = scaleVelocity = 0; scale = .1;
      face.style.transform = "scale(.1)";
      for (const element of magnets.keys()) element.style.removeProperty("translate");
      magnets.clear();
    }
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", reset);
    document.addEventListener("pointercancel", reset);
    document.addEventListener("keydown", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    media.addEventListener("change", configure);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      for (const element of magnets.keys()) element.style.removeProperty("translate");
      badge.remove();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", reset);
      document.removeEventListener("pointercancel", reset);
      document.removeEventListener("keydown", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
      media.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
