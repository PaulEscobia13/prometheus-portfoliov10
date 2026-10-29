"use client";

import { useEffect } from "react";

const targets = ".prometheus-hero-title, .home-section-hero .button-primary, .prometheus-navbar .nav-cta, .prometheus-footer-cta";
type Magnet = { x: number; y: number; vx: number; vy: number; aimX: number; aimY: number };

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
    let lastTime: number | undefined;

    function paint(time = 0) {
      frame = undefined;
      const elapsed = lastTime === undefined ? 1000 / 60 : Math.max(1, Math.min(32, time - lastTime));
      lastTime = time;
      const follow = 1 - Math.exp(-elapsed / 65);
      x += (pointerX - x) * follow;
      y += (pointerY - y) * follow;
      if (positioned) badge.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      let settling = positioned && Math.abs(pointerX - x) + Math.abs(pointerY - y) > .1;
      // Small substeps keep the same damped spring stable across refresh rates.
      const steps = Math.ceil(elapsed / (1000 / 120));
      const dt = elapsed / steps / (1000 / 60);
      for (const [element, spring] of magnets) {
        for (let i = 0; i < steps; i++) {
          spring.vx = (spring.vx + (spring.aimX - spring.x) * .21 * dt) * Math.pow(.78, dt);
          spring.vy = (spring.vy + (spring.aimY - spring.y) * .21 * dt) * Math.pow(.78, dt);
          spring.x += spring.vx * dt;
          spring.y += spring.vy * dt;
        }
        const resting = Math.abs(spring.aimX - spring.x) + Math.abs(spring.aimY - spring.y) + Math.abs(spring.vx) + Math.abs(spring.vy) < .04;
        if (resting && element !== active) {
          element.style.removeProperty("translate");
          magnets.delete(element);
        } else {
          element.style.translate = `${spring.x}px ${spring.y}px`;
          if (!resting) settling = true;
        }
      }
      if (settling) frame = requestAnimationFrame(paint);
      else lastTime = undefined;
    }
    function schedule() { if (frame === undefined) frame = requestAnimationFrame(paint); }
    function reset() {
      active = null;
      badge.removeAttribute("data-visible");
      for (const spring of magnets.values()) spring.aimX = spring.aimY = 0;
      if (magnets.size) schedule();
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
          const spring = magnets.get(active) ?? { x: 0, y: 0, vx: 0, vy: 0, aimX: 0, aimY: 0 };
          magnets.set(active, spring);
          const rect = active.getBoundingClientRect();
          spring.aimX = Math.max(-24, Math.min(24, (pointerX - (rect.left - spring.x + rect.width / 2)) * .38));
          spring.aimY = Math.max(-16, Math.min(16, (pointerY - (rect.top - spring.y + rect.height / 2)) * .38));
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
