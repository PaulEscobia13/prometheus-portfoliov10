"use client";

import { useEffect, useRef } from "react";

export default function FAQItem({ id, question, answer }: { id: string; question: string; answer: string }) {
  const details = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const root = details.current;
    const summary = root?.querySelector("summary");
    const body = root?.querySelector<HTMLElement>(".prometheus-faq-answer");
    if (!root || !summary || !body) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let expanded = root.open;
    let animation: Animation | undefined;

    function finish() {
      animation?.cancel();
      animation = undefined;
      if (root) root.open = expanded;
    }

    function toggle(event: Event) {
      if (!root || !body) return;
      event.preventDefault();
      const from = root.open ? body.getBoundingClientRect().height : 0;
      expanded = !expanded;
      animation?.cancel();
      root.dataset.expanded = String(expanded);
      if (media.matches || !body.animate) { finish(); return; }
      // Keep native details open while closing so its answer can animate out.
      root.open = true;
      const current = body.animate(
        [{ height: `${from}px` }, { height: `${expanded ? body.scrollHeight : 0}px` }],
        { duration: 400, easing: "ease", fill: "both" },
      );
      animation = current;
      current.onfinish = () => { if (animation === current) finish(); };
    }

    summary.addEventListener("click", toggle);
    media.addEventListener("change", finish);
    return () => {
      summary.removeEventListener("click", toggle);
      media.removeEventListener("change", finish);
      finish();
    };
  }, []);

  return (
    <details ref={details} className="prometheus-faq-item">
      <summary aria-controls={`faq-${id}-answer`}>
        <h3>{question}</h3>
        <svg className="prometheus-faq-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" /></svg>
      </summary>
      <div id={`faq-${id}-answer`} className="prometheus-faq-answer"><p>{answer}</p></div>
    </details>
  );
}
