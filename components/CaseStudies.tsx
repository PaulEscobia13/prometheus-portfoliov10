"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CaseStudy } from "../content/caseStudies";
import Image from "next/image";

const readablePunctuation = (text: string) => text.replace(/([,.]) /g, "$1\u2005");

export default function CaseStudies({ cases }: { cases: readonly CaseStudy[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCards, setActiveCards] = useState<Record<string, number>>({});
  const [visibleCards, setVisibleCards] = useState<Record<string, number>>({});
  const displayedCards = useRef<Record<string, number>>({});
  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const navbar = document.querySelector(".prometheus-navbar");
    const measure = () => {
      const top = Math.max(0, navbar?.getBoundingClientRect().bottom ?? 0) + 20;
      const available = Math.max(1, (window.visualViewport?.height ?? window.innerHeight) - top - 24);
      root.style.setProperty("--case-nav-offset", `${top}px`);
      root.style.setProperty("--case-view-height", `${available}px`);
      root.querySelectorAll<HTMLElement>(".prometheus-case-layout").forEach(article => {
        const copy = article.querySelector<HTMLElement>(".prometheus-case-copy");
        if (!copy) return;
        const scale = Math.min(1, available / Math.max(1, copy.offsetHeight));
        // Tiny screens keep the same animated panel, using explicit arrows
        // instead of replacing long copy while the user is scrolling it.
        const manual = window.innerWidth < 992 || scale < .78;
        article.dataset.manual = String(manual);
        article.style.setProperty("--case-copy-scale", String(manual ? 1 : scale));
        article.style.setProperty("--case-copy-height", manual ? "auto" : `${copy.offsetHeight * scale}px`);
        const id = article.id.replace("case-", "");
        article.querySelectorAll<HTMLElement>(".prometheus-case-gallery > figure").forEach((card, index) => {
          card.dataset.selected = String(index === (activeCards[id] ?? 0));
        });
      });
    };
    const observer = new ResizeObserver(measure);
    if (navbar) observer.observe(navbar);
    root.querySelectorAll<HTMLElement>(".prometheus-case-copy").forEach(copy => observer.observe(copy));
    measure();
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); window.visualViewport?.removeEventListener("resize", measure); };
  }, [cases, activeCards]);
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string, index: number) => {
    if (event.currentTarget.closest<HTMLElement>(".prometheus-case-layout")?.dataset.manual !== "true") return;
    event.preventDefault();
    setVisibleCards(previous => ({ ...previous, [id]: index }));
  };
  useEffect(() => {
    const changed = cases.filter(item => item.story && Math.min(displayedCards.current[item.id] ?? 0, item.story.length - 1) !== Math.min(visibleCards[item.id] ?? 0, item.story.length - 1));
    const elements = changed.flatMap(item => Array.from(sectionRef.current?.querySelectorAll<HTMLElement>(`#case-${item.id} .prometheus-case-title, #case-${item.id} .prometheus-case-review, #case-${item.id} .prometheus-case-footer`) ?? []));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animations: Animation[] = [];
    let timer = 0;
    let frame = 0;
    const reveal = () => {
      displayedCards.current = visibleCards;
      setActiveCards(visibleCards);
      if (!reduced) frame = requestAnimationFrame(() => {
        animations.forEach(animation => animation.cancel());
        elements.forEach((element, index) => animations.push(element.animate([
          { opacity: 0, transform: "translateY(12px)" },
          { opacity: 1, transform: "translateY(-2px)", offset: .8 },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 440, delay: index * 35, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" })));
      });
    };
    if (elements.length && !reduced) {
      elements.forEach(element => animations.push(element.animate([
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(-6px)" },
      ], { duration: 160, easing: "ease-in", fill: "forwards" })));
      timer = window.setTimeout(reveal, 160);
    } else reveal();
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); animations.forEach(animation => animation.cancel()); };
  }, [visibleCards, cases]);
  useEffect(() => {
    const articles = Array.from(sectionRef.current?.querySelectorAll<HTMLElement>(".prometheus-case-layout") ?? []);
    const galleries = articles.map(article => ({
      id: article.id.replace("case-", ""),
      article,
      cards: Array.from(article.querySelectorAll<HTMLElement>(".prometheus-case-gallery > figure")),
    }));
    galleries.forEach(({ id, cards }) => cards.forEach((card, index) => { card.id = `case-${id}-image-${index}`; }));
    let frame = 0;
    const update = () => {
      frame = 0;
      const focusLine = (document.querySelector(".prometheus-navbar")?.getBoundingClientRect().bottom ?? 0) + 20;
      const next: Record<string, number> = {};
      galleries.forEach(({ id, article, cards }) => {
        if (article.dataset.manual === "true") return;
        next[id] = 0;
        cards.forEach((card, index) => {
          if (card.getBoundingClientRect().top <= focusLine) next[id] = index;
        });
      });
      setVisibleCards(previous => Object.keys(next).every(id => previous[id] === next[id]) ? previous : { ...previous, ...next });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [cases]);
  return (
    <section ref={sectionRef} id="works" className="home-updated-section prometheus-cases" aria-labelledby="works-title">
      <div className="home-container w-container">
        <h2 id="works-title" className="home-title-upcase prometheus-cases-eyebrow">Our cases</h2>
        <div className="prometheus-case-stack">
          {cases.map((original, index) => {
            const active = activeCards[original.id] ?? 0;
            const story = original.story?.[Math.min(active, original.story.length - 1)];
            const showRating = !story?.team && (!original.story || active === original.story.length - 1);
            const item = story ? { ...original, headline: story.headline, feedback: { ...original.feedback, ...story } } : original;
            return (
            <article id={`case-${item.id}`} className="prometheus-case-layout" key={item.id} aria-labelledby={`case-title-${item.id}`}>
              <div className="prometheus-case-details"><div className="prometheus-case-copy">
                <div className="prometheus-case-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}<span className="prometheus-case-country" role="img" aria-label="Philippines" title="Philippines"><svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true"><path fill="#0038a8" d="M0 0h30v10H0z"/><path fill="#ce1126" d="M0 10h30v10H0z"/><path fill="#fff" d="m0 0 17.32 10L0 20z"/><g fill="#fcd116"><circle cx="6" cy="10" r="2"/><path stroke="#fcd116" strokeWidth=".7" d="M6 6v8m-4-4h8M3.2 7.2l5.6 5.6m0-5.6-5.6 5.6"/><path d="m2.5 2 .3 1 1 .1-.8.6.3 1- .8-.6-.8.6.3-1-.8-.6 1-.1zm0 13 .3 1 1 .1-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6 1-.1zm11-6.5.3 1 1 .1-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6 1-.1z"/></g></svg></span></div>
                <h3 id={`case-title-${item.id}`} className="prometheus-case-title">{readablePunctuation(item.headline)}</h3>
                <div className="prometheus-case-review" data-sample={item.feedback.isSample}>
                  <div className="prometheus-case-rating-row">
                    <span className="prometheus-case-review-source">{original.story && active === 0 ? "Challenge" : story?.team ? "Our\u2002Approach" : "Review"}</span>
                    {showRating && <span className="prometheus-case-stars" role="img" aria-label={`${item.feedback.isSample ? "Sample " : ""}rating: ${item.feedback.rating} out of 5`}>
                      {Array.from({ length: 5 }, (_, star) => <Star key={star} filled={star < item.feedback.rating} />)}
                    </span>}
                  </div>
                  <blockquote className="prometheus-case-testimonial">{readablePunctuation(item.feedback.quote)}</blockquote>
                </div>
                <div className="prometheus-case-footer">
                  <div className="prometheus-case-person">
                    {item.feedback.portrait ? <Image src={item.feedback.portrait} alt={item.feedback.name} width={64} height={64} className={`prometheus-case-avatar is-photo${story?.team ? " is-team" : ""}`} /> : <span className={`prometheus-case-avatar is-${item.feedback.portraitPosition}`} role="img" aria-label="Fictional sample client portrait" />}
                    <div className="prometheus-case-signature">
                      <p className="prometheus-case-name">{item.feedback.name}</p>
                      <p className="prometheus-case-category">{readablePunctuation(item.feedback.role)}</p>
                    </div>
                  </div>
                  <div className="prometheus-case-controls" aria-label={`${item.name} case navigation`}>
                    <div className="prometheus-case-control-buttons">
                      <a onClick={event => navigate(event, item.id, Math.max(0, active - 1))} href={original.story ? `#case-${item.id}-image-${Math.max(0, active - 1)}` : `#case-${cases[Math.max(0, index - 1)].id}`} aria-label={original.story ? "Previous project image" : "Previous case"}><Arrow up /></a>
                      <a onClick={event => navigate(event, item.id, Math.min(3, active + 1))} href={original.story ? `#case-${item.id}-image-${Math.min(3, active + 1)}` : `#case-${cases[Math.min(cases.length - 1, index + 1)].id}`} aria-label={original.story ? "Next project image" : "Next case"}><Arrow /></a>
                    </div>
                  </div>
                </div>
              </div></div>
              <div className="prometheus-case-gallery" aria-label={`${item.name} project gallery`}>
                {item.coverImage && <figure className="prometheus-case-visual prometheus-case-brand-cover"><Image src={item.coverImage} alt={`${item.name} brand artwork`} width={1614} height={975} sizes="(max-width: 767px) 100vw, 60vw" /></figure>}
                {(item.coverImage ? (item.screenshots ?? []).slice(1) : (item.screenshots ?? [])).map((source, imageIndex) => (
                  imageIndex === 0 && item.showcaseImage ? <figure key={source} className="prometheus-case-visual prometheus-case-showcase"><Image src={item.showcaseImage} alt={`${item.name} digital showroom showcase`} width={item.id === "piercing-corner" ? 1440 : 1448} height={item.id === "piercing-corner" ? 1024 : 1086} sizes="(max-width: 767px) 100vw, 60vw" /></figure> : <figure key={source} className={`prometheus-case-visual prometheus-case-screenshot-card is-${item.id}`}>
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.name} live website`} className={`prometheus-case-device${source.includes("-mobile") ? " is-mobile" : ""}`}>
                      <div className="prometheus-case-device-bar" aria-hidden="true"><i /><i /><i /><span>{item.name}</span></div>
                      <img src={source} alt={`${item.name}, ${source.includes("-mobile") ? "mobile" : "desktop"} website preview ${imageIndex + 1}`} className="prometheus-case-screenshot" />
                    </a>
                  </figure>
                ))}
                {(item.screenshots?.length ?? 0) < 4 && (item.operationsImage ? <figure className="prometheus-case-visual prometheus-case-showcase"><Image src={item.operationsImage} alt={`${item.name} centralized business operations showcase`} width={1448} height={1086} sizes="(max-width: 767px) 100vw, 60vw" /></figure> : <ProjectOverview item={item} />)}
                {(item.screenshots?.length ?? 0) < 3 && (item.workspaceImage ? <figure className="prometheus-case-visual prometheus-case-showcase"><Image src={item.workspaceImage} alt={`${item.name} website and business system across desktop, tablet, laptop, and mobile`} width={1536} height={1024} sizes="(max-width: 767px) 100vw, 60vw" /></figure> : <ProjectScope item={item} />)}
              </div>
            </article>
          ); })}
        </div>
      </div>
    </section>
  );
}

function ProjectOverview({ item }: { item: CaseStudy }) {
  return <figure className={`prometheus-case-visual is-${item.id}`}><div className="prometheus-case-overview"><p className="prometheus-case-overview-label">Project overview</p><img src={item.logo} alt={item.name} className="prometheus-case-logo" /><p className="prometheus-case-overview-title">{item.category}</p></div></figure>;
}

function ProjectScope({ item }: { item: CaseStudy }) {
  return <figure className={`prometheus-case-visual prometheus-case-scope-card is-${item.id}`}><div className="prometheus-case-overview"><p className="prometheus-case-overview-label">Project scope</p><p className="prometheus-case-overview-title">{item.name}</p><ul className="prometheus-case-scope-list">{item.capabilities.map((capability, index) => <li key={capability}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>)}</ul></div></figure>;
}

function Arrow({ up = false }: { up?: boolean }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ rotate: up ? "180deg" : undefined }}><path d="M12 3V21M12 21L4 13M12 21L20 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Star({ filled }: { filled: boolean }) {
  return <Image src="/assets/65815e7aa6d92ba4f0599c29_star-green.svg" width={18} height={18} alt="" aria-hidden="true" style={{ opacity: filled ? 1 : .2 }} />;
}
