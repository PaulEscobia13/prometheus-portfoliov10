"use client";

import { useEffect, useRef, useState } from "react";

const images = Array.from({ length: 14 }, (_, index) => `/showcase/sheet-${String(index + 1).padStart(2, "0")}.webp`);

export default function FooterWordmark({ logo = false }: { logo?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const play = useRef<() => void>(() => {});
  const stop = useRef<() => void>(() => {});
  const move = useRef<(x: number, y: number) => void>(() => {});
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let cycle: ReturnType<typeof setInterval> | undefined;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let hovering = false;
    let lastX = 0, lastY = 0;
    const pause = () => { clearInterval(cycle); cycle = undefined; };
    const resume = () => {
      if (!hovering || media.matches || cycle) return;
      cycle = setInterval(() => setCurrent(index => (index + 1) % images.length), 200);
    };
    play.current = () => {
      if (media.matches) return;
      // Clicking can focus an already hovered mark. Do not restart its cycle.
      if (hovering) return;
      hovering = true;
      setActive(true);
      setCurrent(0);
      resume();
    };
    stop.current = () => {
      hovering = false;
      pause();
      clearTimeout(idle);
      setActive(false);
      setCurrent(0);
      element.style.setProperty("--wordmark-x", "0%");
      element.style.setProperty("--wordmark-y", "0%");
    };
    move.current = (x, y) => {
      if (!hovering || media.matches) return;
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--wordmark-x", `${((x - rect.left) / rect.width * 2 - 1) * 7}%`);
      element.style.setProperty("--wordmark-y", `${((y - rect.top) / rect.height * 2 - 1) * 7}%`);
      if (Math.abs(x - lastX) > 1 || Math.abs(y - lastY) > 1) {
        lastX = x; lastY = y;
        resume();
        clearTimeout(idle);
        idle = setTimeout(pause, 500);
      }
    };
    const preload = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      images.forEach(src => { const image = new window.Image(); image.src = src; });
      preload.disconnect();
    }, { rootMargin: "400px" });
    preload.observe(element);
    const reset = () => stop.current();
    const visibility = () => { if (document.hidden) reset(); };
    media.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      pause(); clearTimeout(idle); preload.disconnect();
      media.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <div ref={root} className={logo ? "prometheus-footer-hover-logo" : "prometheus-footer-wordmark"} data-imagery={active} role="img" aria-label={logo ? "Prometheus flame — hover to explore our projects" : "Prometheus — hover to explore our projects"} tabIndex={0}
    onPointerEnter={event => { if (event.pointerType === "mouse") play.current(); }}
    onPointerMove={event => { if (event.pointerType === "mouse") move.current(event.clientX, event.clientY); }}
    onPointerLeave={() => stop.current()} onPointerCancel={() => stop.current()}
    onFocus={() => play.current()} onBlur={() => stop.current()}
    onKeyDown={event => { if (event.key === "Escape") stop.current(); }}>
    <span className="footer-wordmark-solid" aria-hidden="true">{logo ? "" : "PROMETHEUS"}</span>
    {images.map((src, index) => <span key={src} aria-hidden="true" className="footer-wordmark-image" data-current={active && index === current} style={{ backgroundImage: `url('${src}')` }}>{logo ? "" : "PROMETHEUS"}</span>)}
  </div>;
}
