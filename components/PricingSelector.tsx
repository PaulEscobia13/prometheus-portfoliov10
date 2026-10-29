"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Option = { value: string; label: string };

export default function PricingSelector({ options, value, onChange }: {
  options: readonly Option[];
  value: string;
  onChange: (value: string) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const indicator = useRef<HTMLSpanElement>(null);
  const animation = useRef<Animation | null>(null);
  const [slideDuration, setSlideDuration] = useState(420);
  useEffect(() => () => animation.current?.cancel(), []);
  const activeIndex = Math.max(0, options.findIndex(option => option.value === value));
  const select = (index: number) => {
    if (index === activeIndex) return;
    const duration = 420 * Math.abs(index - activeIndex);
    setSlideDuration(duration);
    onChange(options[index].value);
    animation.current?.cancel();
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animation.current = indicator.current?.animate([
        { scale: "1 1" },
        { scale: "1.14 .96", offset: .35 },
        { scale: ".98 1.02", offset: .78 },
        { scale: "1 1" },
      ], { duration, easing: "ease-out" }) ?? null;
    }
  };
  return <div className="pricing-selector" role="radiogroup" aria-label="Pricing options" style={{ "--selector-count": options.length, "--selector-index": activeIndex, "--selector-duration": `${slideDuration}ms` } as CSSProperties}>
    <span ref={indicator} className="pricing-selector-indicator" aria-hidden="true" />
    {options.map((option, index) => <button
      ref={element => { buttons.current[index] = element; }}
      key={option.value}
      type="button"
      role="radio"
      aria-checked={index === activeIndex}
      tabIndex={index === activeIndex ? 0 : -1}
      onClick={() => select(index)}
      onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % options.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + options.length - 1) % options.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = options.length - 1;
        else return;
        event.preventDefault();
        buttons.current[next]?.focus();
        select(next);
      }}
    >{option.label}</button>)}
  </div>;
}

const audiences = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
  { value: "others", label: "Others" },
];

export function PricingAudienceSelector() {
  const [audience, setAudience] = useState("business");
  return <PricingSelector options={audiences} value={audience} onChange={setAudience} />;
}
