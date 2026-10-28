"use client";

import { useState } from "react";
import type { CaseStudy } from "../content/caseStudies";

export default function CaseStudies({ cases }: { cases: readonly CaseStudy[] }) {
  const [index, setIndex] = useState(0);
  const active = cases[index];
  if (!active) return null;
  const move = (direction: number) => setIndex(value => (value + direction + cases.length) % cases.length);

  return (
    <section id="works" className="home-updated-section prometheus-cases" aria-labelledby="works-title" aria-roledescription="carousel">
      <div className="home-container w-container">
        <h2 id="works-title" className="home-title-upcase prometheus-cases-eyebrow">Our cases</h2>
        <div className="prometheus-case-layout" key={active.id}>
          <article className="prometheus-case-details" aria-labelledby={`case-title-${active.id}`}>
            <div className="prometheus-case-tags">{active.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <h3 id={`case-title-${active.id}`} className="prometheus-case-title">{active.headline}</h3>
            <div className="prometheus-case-scope">
              <p className="prometheus-case-scope-label">What we built</p>
              <p className="prometheus-case-description">{active.description}</p>
              <ul className="prometheus-case-capabilities">{active.capabilities.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="prometheus-case-signature">
              <p className="prometheus-case-name">{active.name}</p>
              <p className="prometheus-case-category">Client project · {active.category}</p>
            </div>
            <a className="prometheus-case-live-link" href={active.liveUrl} target="_blank" rel="noopener noreferrer">View live website <span aria-hidden="true">↗</span></a>
          </article>
          <figure className={`prometheus-case-visual is-${active.id}`}>
            {active.screenshot ? (
              <img src={active.screenshot} alt={`${active.name} project screenshot`} className="prometheus-case-screenshot" />
            ) : (
              <div className="prometheus-case-overview">
                <p className="prometheus-case-overview-label">Project overview</p>
                <img src={active.logo} alt={active.name} className="prometheus-case-logo" />
                <p className="prometheus-case-overview-title">{active.category}</p>
                <div className="prometheus-case-overview-features">{active.capabilities.map(item => <span key={item}>{item}</span>)}</div>
              </div>
            )}
          </figure>
        </div>
        <div className="prometheus-case-controls" data-case-controls onKeyDown={event => {
          if (["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            move(event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1);
          }
        }}>
          <span className="prometheus-case-counter" aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => move(-1)} aria-label="Previous case"><Arrow up /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next case"><Arrow /></button>
        </div>
        <p className="prometheus-case-announcement" role="status" aria-live="polite" aria-atomic="true">{active.name}, case {index + 1} of {cases.length}</p>
      </div>
    </section>
  );
}

function Arrow({ up = false }: { up?: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ rotate: up ? "180deg" : undefined }}><path d="M12 3V21M12 21L4 13M12 21L20 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
