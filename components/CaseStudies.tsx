import type { CaseStudy } from "../content/caseStudies";

export default function CaseStudies({ cases }: { cases: readonly CaseStudy[] }) {
  return (
    <section id="works" className="home-updated-section prometheus-cases" aria-labelledby="works-title">
      <div className="home-container w-container">
        <h2 id="works-title" className="home-title-upcase prometheus-cases-eyebrow">Our cases</h2>
        <div className="prometheus-case-stack">
          {cases.map((item, index) => (
            <article id={`case-${item.id}`} className="prometheus-case-layout" key={item.id} aria-labelledby={`case-title-${item.id}`}>
              <div className="prometheus-case-details">
                <div className="prometheus-case-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}<span className="prometheus-case-country" role="img" aria-label="Philippines" title="Philippines"><svg width="30" height="20" viewBox="0 0 30 20" aria-hidden="true"><path fill="#0038a8" d="M0 0h30v10H0z"/><path fill="#ce1126" d="M0 10h30v10H0z"/><path fill="#fff" d="m0 0 17.32 10L0 20z"/><g fill="#fcd116"><circle cx="6" cy="10" r="2"/><path stroke="#fcd116" strokeWidth=".7" d="M6 6v8m-4-4h8M3.2 7.2l5.6 5.6m0-5.6-5.6 5.6"/><path d="m2.5 2 .3 1 1 .1-.8.6.3 1- .8-.6-.8.6.3-1-.8-.6 1-.1zm0 13 .3 1 1 .1-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6 1-.1zm11-6.5.3 1 1 .1-.8.6.3 1-.8-.6-.8.6.3-1-.8-.6 1-.1z"/></g></svg></span></div>
                <h3 id={`case-title-${item.id}`} className="prometheus-case-title">{item.headline}</h3>
                <div className="prometheus-case-review" data-sample={item.feedback.isSample}>
                  <div className="prometheus-case-rating-row">
                    <span className="prometheus-case-review-source">Review</span>
                    <span className="prometheus-case-stars" role="img" aria-label={`${item.feedback.isSample ? "Sample " : ""}rating: ${item.feedback.rating} out of 5`}>
                      {Array.from({ length: 5 }, (_, star) => <Star key={star} filled={star < item.feedback.rating} />)}
                    </span>
                    {item.feedback.isSample && <span className="prometheus-case-sample-label">Sample review</span>}
                  </div>
                  <blockquote className="prometheus-case-testimonial">{item.feedback.quote}</blockquote>
                </div>
                <div className="prometheus-case-footer">
                  <div className="prometheus-case-person">
                    <span className={`prometheus-case-avatar is-${item.feedback.portraitPosition}`} role="img" aria-label="Fictional sample client portrait" />
                    <div className="prometheus-case-signature">
                      <p className="prometheus-case-name">{item.feedback.name}</p>
                      <p className="prometheus-case-category">{item.feedback.role}</p>
                    </div>
                  </div>
                  <div className="prometheus-case-controls" aria-label={`${item.name} case navigation`}>
                    <div className="prometheus-case-control-buttons">
                      <a href={`#case-${cases[Math.max(0, index - 1)].id}`} aria-label={`Previous case: ${cases[Math.max(0, index - 1)].name}`}><Arrow up /></a>
                      <a href={`#case-${cases[Math.min(cases.length - 1, index + 1)].id}`} aria-label={`Next case: ${cases[Math.min(cases.length - 1, index + 1)].name}`}><Arrow /></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="prometheus-case-gallery" aria-label={`${item.name} project gallery`}>
                {(item.screenshots ?? []).map((source, imageIndex) => (
                  <figure key={source} className={`prometheus-case-visual prometheus-case-screenshot-card is-${item.id}`}>
                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${item.name} live website`} className={`prometheus-case-device${source.includes("-mobile") ? " is-mobile" : ""}`}>
                      <div className="prometheus-case-device-bar" aria-hidden="true"><i /><i /><i /><span>{item.name}</span></div>
                      <img src={source} alt={`${item.name}, ${source.includes("-mobile") ? "mobile" : "desktop"} website preview ${imageIndex + 1}`} className="prometheus-case-screenshot" />
                    </a>
                  </figure>
                ))}
                {(!item.screenshots || item.screenshots.length < 2) && <ProjectOverview item={item} />}
                {(!item.screenshots || item.screenshots.length === 0) && <ProjectScope item={item} />}
              </div>
            </article>
          ))}
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
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1L12 2Z" /></svg>;
}
