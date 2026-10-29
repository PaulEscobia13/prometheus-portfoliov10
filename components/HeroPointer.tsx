"use client";

import { useEffect } from "react";

const targets = ".prometheus-hero-title, .home-section-hero .button-primary, .prometheus-navbar .nav-cta, .prometheus-footer-cta";

export default function HeroPointer() {
  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const badge = document.createElement("span");
    badge.className = "prometheus-logo-cursor";
    badge.setAttribute("aria-hidden", "true");
    const logo = document.createElement("img");
    logo.src = "/favicons/prometheus-cream.png";
    logo.alt = "";
    badge.append(logo);
    document.body.append(badge);
    let active: HTMLElement | null = null;
    let magnetic: HTMLElement | null = null;
    let frame: number | undefined;
    let x = 0, y = 0, dx = 0, dy = 0, aimX = 0, aimY = 0;

    function paint() {
      frame = undefined;
      if (!magnetic) return;
      dx += (aimX - dx) * .16;
      dy += (aimY - dy) * .16;
      magnetic.style.translate = `${dx}px ${dy}px`;
      if (Math.abs(aimX - dx) + Math.abs(aimY - dy) > .05) frame = requestAnimationFrame(paint);
      else if (!active) { magnetic.style.removeProperty("translate"); magnetic = null; dx = dy = 0; }
    }
    function schedule() { if (frame === undefined) frame = requestAnimationFrame(paint); }
    function reset() {
      active?.classList.remove("has-logo-cursor");
      active = null;
      badge.removeAttribute("data-visible");
      aimX = aimY = 0;
      if (magnetic) schedule();
    }
    function move(event: PointerEvent) {
      if (!media.matches || event.pointerType !== "mouse") { reset(); return; }
      const next = event.target instanceof Element ? event.target.closest<HTMLElement>(targets) : null;
      if (next !== active) {
        reset();
        if (magnetic && next) { magnetic.style.removeProperty("translate"); magnetic = null; dx = dy = 0; }
        active = next;
        active?.classList.add("has-logo-cursor");
      }
      if (!active) return;
      x = event.clientX; y = event.clientY;
      badge.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      badge.dataset.visible = "true";
      const isButton = active.matches("a");
      badge.dataset.cta = String(isButton);
      if (isButton) {
        magnetic = active;
        const rect = magnetic.getBoundingClientRect();
        aimX = Math.max(-8, Math.min(8, (x - (rect.left - dx + rect.width / 2)) * .14));
        aimY = Math.max(-6, Math.min(6, (y - (rect.top - dy + rect.height / 2)) * .14));
        schedule();
      }
    }
    function configure() {
      if (media.matches) return;
      reset();
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      magnetic?.style.removeProperty("translate");
      magnetic = null;
      dx = dy = 0;
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
      active?.classList.remove("has-logo-cursor");
      magnetic?.style.removeProperty("translate");
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
