"use client";

import { useEffect } from "react";

const sources = ["/favicons/prometheus-cream.png", "/favicons/prometheus-red.png"];

function roundedIcon(source: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 64;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("Favicon canvas is unavailable"));
      context.beginPath();
      context.roundRect(0, 0, 64, 64, 14);
      context.clip();
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      const scale = Math.max(64 / image.naturalWidth, 64 / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (64 - width) / 2, (64 - height) / 2, width, height);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error(`Missing favicon image: ${source}`));
    image.src = source;
  });
}

export default function RotatingFavicon() {
  useEffect(() => {
    let disposed = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    let link: HTMLLinkElement | undefined;

    Promise.all(sources.map(roundedIcon)).then(icons => {
      if (disposed) return;
      let index = 0;
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.sizes.add("64x64");
      link.dataset.prometheusFavicon = "true";
      link.href = icons[index];
      document.head.appendChild(link);
      // Reuse two pre-rendered PNGs; no image fetch or redraw on each tick.
      interval = setInterval(() => {
        index = (index + 1) % icons.length;
        if (link) link.href = icons[index];
      }, 4000);
    }).catch(error => {
      if (!disposed) console.warn("Install the Prometheus favicon images with scripts/install-favicons.ps1.", error);
    });

    return () => {
      disposed = true;
      if (interval !== undefined) clearInterval(interval);
      link?.remove();
    };
  }, []);

  return null;
}
