"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let frame: number | undefined;

    function stop() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      lenis?.destroy();
      lenis = undefined;
    }

    function configure() {
      stop();
      if (reducedMotion.matches) return;

      // Same interpolation and wheel multiplier as the supplied live-site capture.
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        infinite: false,
        easing: (t: number) => t * (2 - t),
      });

      function animate(time: number) {
        lenis?.raf(time);
        frame = requestAnimationFrame(animate);
      }
      frame = requestAnimationFrame(animate);
    }

    configure();
    reducedMotion.addEventListener("change", configure);
    return () => {
      reducedMotion.removeEventListener("change", configure);
      stop();
    };
  }, []);

  return null;
}
