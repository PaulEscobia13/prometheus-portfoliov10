"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function FooterReveal({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = footer.current;
    const main = root?.previousElementSibling;
    if (!root || !(main instanceof HTMLElement)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;

    function update() {
      frame = undefined;
      if (!root || !(main instanceof HTMLElement)) return;
      // Read the natural page edge: the sticky footer's own rectangle is pinned.
      const progress = Math.min(1, Math.max(0, (window.innerHeight - main.getBoundingClientRect().bottom) / Math.max(1, root.offsetHeight)));
      root.style.setProperty("--footer-reveal-offset", `${media.matches ? 0 : 40 * (1 - progress)}px`);
    }
    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(update);
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    resize.observe(main);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  return <footer ref={footer} id="contacts" className="prometheus-editorial-footer" aria-label="Prometheus footer">{children}</footer>;
}
