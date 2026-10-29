"use client";

import { useEffect, useRef, useState } from "react";

export default function FooterWordmark({ images }: { images: string[] }) {
  const wordmark = useRef<HTMLDivElement>(null);
  const [layers, setLayers] = useState<(string | null)[]>([null, null]);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const element = wordmark.current;
    if (!element || !images.length) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let disposed = false;
    let pending = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let index = 0;
    let slot = 0;
    let hasImage = false;
    const allowed = () => !disposed && visible && !document.hidden && !preference.matches;
    const stop = () => { clearTimeout(timer); timer = undefined; };

    async function advance() {
      timer = undefined;
      if (!allowed() || pending) return;
      pending = true;
      const source = images[index];
      index = (index + 1) % images.length;
      const image = new window.Image();
      try {
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error("Artwork unavailable"));
          image.src = source;
        });
        if (image.decode) await image.decode();
        if (!allowed()) return;
        const nextSlot = slot;
        setLayers(previous => previous.map((value, layer) => layer === nextSlot ? source : value));
        setActive(nextSlot);
        slot = 1 - slot;
        hasImage = true;
      } catch { /* Keep the current look when an artwork cannot be loaded. */ }
      finally {
        pending = false;
        image.onload = image.onerror = null;
        if (allowed()) timer = setTimeout(advance, 1500);
      }
    }

    function refresh() {
      stop();
      if (preference.matches) { setActive(null); hasImage = false; }
      if (allowed() && !pending) timer = setTimeout(advance, hasImage ? 1500 : 600);
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      refresh();
    }, { threshold: .05 });
    observer.observe(element);
    preference.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      preference.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [images]);

  return <div ref={wordmark} className="prometheus-footer-wordmark" aria-hidden="true">
    <span className="footer-wordmark-base">PROMETHEUS</span>
    {layers.map((source, layer) => <span key={layer} className="footer-wordmark-art" data-active={active === layer} style={source ? { backgroundImage: `linear-gradient(rgb(255 244 234 / 12%), rgb(255 244 234 / 12%)), url(${JSON.stringify(source)})` } : undefined}>PROMETHEUS</span>)}
  </div>;
}
