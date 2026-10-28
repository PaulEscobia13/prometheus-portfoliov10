"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function TeamReveal({ children }: { children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = section.current;
    const panel = stage.current;
    if (!root || !panel) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    function paint() {
      frame = undefined;
      if (!root || !panel) return;
      const distance = window.innerHeight;
      root.style.setProperty("--team-height", `${panel.offsetHeight}px`);
      root.style.setProperty("--team-distance", `${distance}px`);
      // Hold briefly at either end, then slide both halves completely offscreen.
      const progress = Math.min(1, Math.max(0, (-root.getBoundingClientRect().top / distance - .08) / .82));
      root.style.setProperty("--team-open", String(progress));
      root.dataset.revealed = String(progress >= 1);
      if (skip.current) skip.current.inert = progress >= 1 || media.matches;
    }

    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(paint);
    }

    function configure() {
      if (!root) return;
      root.dataset.animated = String(!media.matches);
      paint();
    }

    const resize = new ResizeObserver(schedule);
    resize.observe(panel);
    configure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", configure);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", configure);
      delete root.dataset.animated;
    };
  }, []);

  function revealTeam() {
    const root = section.current;
    if (!root) return;
    const distance = root.dataset.animated === "true" ? window.innerHeight : 0;
    const top = window.scrollY + root.getBoundingClientRect().top + distance;
    const request = new window.CustomEvent("prometheus:scroll-to", { detail: top, cancelable: true });
    if (window.dispatchEvent(request)) window.scrollTo({ top, behavior: "instant" });
    root.querySelector<HTMLElement>("#team-title")?.focus({ preventScroll: true });
  }

  return (
    <section id="about" ref={section} className="prometheus-team" aria-labelledby="team-title">
      <div ref={stage} className="team-sticky">
        {children}
        <div className="team-cover" aria-hidden="true">
          <div className="team-cover-half team-cover-left"><div className="team-cover-face"><span>Team</span></div></div>
          <div className="team-cover-half team-cover-right"><div className="team-cover-face"><span>Team</span></div></div>
          <p className="team-cover-caption">The people behind Prometheus</p>
        </div>
        <button ref={skip} className="team-reveal-skip" type="button" onClick={revealTeam}>Meet the team <span aria-hidden="true">↓</span></button>
      </div>
    </section>
  );
}
