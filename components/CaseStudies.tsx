"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { CaseStudy } from "../content/caseStudies";
import Image from "next/image";

const readablePunctuation = (text: string) => text.replace(/([,.]) /g, "$1\u2005");

export default function CaseStudies({ cases }: { cases: readonly CaseStudy[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const navbar = document.querySelector(".prometheus-navbar");
    const update = () => {
      const offset = Math.max(0, navbar?.getBoundingClientRect().bottom ?? 0) + 20;
      root.style.setProperty("--case-nav-offset", `${offset}px`);
      const available = (window.visualViewport?.height ?? window.innerHeight) - offset - 24;
      root.querySelectorAll<HTMLElement>(".prometheus-case-details").forEach(panel => {
        panel.dataset.fits = String(panel.offsetHeight <= available);
      });
    };
    const observer = new ResizeObserver(update);
    if (navbar) observer.observe(navbar);
    root.querySelectorAll<HTMLElement>(".prometheus-case-details").forEach(panel => observer.observe(panel));
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [cases]);
  return (
    <section ref={sectionRef} id="works" className="home-updated-section prometheus-cases" aria-labelledby="works-title">
      <div className="home-container w-container">
        <h2 id="works-title" className="home-title-upcase prometheus-cases-eyebrow">Our cases</h2>
        <div className="prometheus-case-stack">
          {cases.map((original, index) => {
            const visuals = caseVisuals(original);
            const storyCount = original.story?.length || 1;
            return <div id={`case-${original.id}`} className="prometheus-case-group" key={original.id}>
              {Array.from({ length: storyCount }, (_, active) => {
                const story = original.story?.[active];
                const showRating = !story?.team && (!original.story || active === storyCount - 1);
                const item = story ? { ...original, headline: story.headline, feedback: { ...original.feedback, ...story } } : original;
                const images = active === storyCount - 1 ? visuals.slice(active) : visuals.slice(active, active + 1);
                return <article id={`case-${item.id}-image-${active}`} className="prometheus-case-layout" key={active} aria-labelledby={`case-title-${item.id}-${active}`}>
              <div className="prometheus-case-details">
                <div className="prometheus-case-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}<span className="prometheus-case-country" role="img" aria-label="Philippines" title="Philippines"><svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true"><path fill="#0038a8" d="M0 0h30v10H0z"/><path fill="#ce1126" d="M0 10h30v10H0z"/><path fill="#fff" d="m0 0 17.32 10L0 20z"/><g fill="#fcd116"><circle cx="6" cy="10" r="2"/><path stroke="#fcd116" strokeWidth=".7" d="M6 6v8m-4-4h8M3.2 7.2l5.6 5.6m0-5.6-5.6 5.6"/><path d="m2.5 2 .3 1 1 .1-.8.6.3 1- .8-.6-.8.6.3-1-.8-.6 1-.1zm0 13 .3 1 1 .1-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6 1-.1zm11-6.5.3 1 1 .1-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6 1-.1z"/></g></svg></span></div>
                <h3 id={`case-title-${item.id}-${active}`} className="prometheus-case-title">{readablePunctuation(item.headline)}</h3>
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
                      <a href={original.story ? `#case-${item.id}-image-${Math.max(0, active - 1)}` : `#case-${cases[Math.max(0, index - 1)].id}`} aria-label={original.story ? "Previous project image" : "Previous case"}><Arrow up /></a>
                      <a href={original.story ? `#case-${item.id}-image-${Math.min(storyCount - 1, active + 1)}` : `#case-${cases[Math.min(cases.length - 1, index + 1)].id}`} aria-label={original.story ? "Next project image" : "Next case"}><Arrow /></a>
                    </div>
                  </div>
                </div>
              </div>
                  <div className="prometheus-case-gallery" aria-label={`${item.name} project gallery, part ${active + 1}`}>
                    {images}
                  </div>
                </article>;
              })}
            </div>;
          })}
        </div>
      </div>
    </section>
  );
}

function caseVisuals(item: CaseStudy): ReactNode[] {
  const visuals: ReactNode[] = [];
  const picture = (source: string, label: string, width: number, height: number, cover = false) => (
    <figure key={source} className={`prometheus-case-visual ${cover ? "prometheus-case-brand-cover" : "prometheus-case-showcase"}`}>
      <Image src={source} alt={`${item.name} ${label}`} width={width} height={height} sizes="(max-width: 767px) 100vw, 60vw" />
    </figure>
  );
  if (item.coverImage) visuals.push(picture(item.coverImage, "brand artwork", 1614, 975, true));
  const screenshots = item.coverImage ? (item.screenshots ?? []).slice(1) : (item.screenshots ?? []);
  if (!screenshots.length && item.showcaseImage) visuals.push(picture(item.showcaseImage, "digital showroom showcase", 1448, 1086));
  screenshots.forEach((source, imageIndex) => {
    if (imageIndex === 0 && item.showcaseImage) visuals.push(picture(item.showcaseImage, "digital showroom showcase", 1448, 1086));
    else visuals.push(<figure key={source} className={`prometheus-case-visual prometheus-case-screenshot-card is-${item.id}`}>
      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.name} live website`} className={`prometheus-case-device${source.includes("-mobile") ? " is-mobile" : ""}`}>
        <div className="prometheus-case-device-bar" aria-hidden="true"><i /><i /><i /><span>{item.name}</span></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={source} alt={`${item.name}, website preview ${imageIndex + 1}`} className="prometheus-case-screenshot" />
      </a>
    </figure>);
  });
  if ((item.screenshots?.length ?? 0) < 4) visuals.push(item.operationsImage ? picture(item.operationsImage, "centralized business operations showcase", 1448, 1086) : <ProjectOverview key="overview" item={item} />);
  if ((item.screenshots?.length ?? 0) < 3) visuals.push(item.workspaceImage ? picture(item.workspaceImage, "website and business system across devices", 1536, 1024) : <ProjectScope key="scope" item={item} />);
  return visuals;
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
