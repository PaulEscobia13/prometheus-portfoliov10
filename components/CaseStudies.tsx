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
                <div className="prometheus-case-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <h3 id={`case-title-${item.id}`} className="prometheus-case-title">{item.headline}</h3>
                <div className="prometheus-case-scope">
                  <p className="prometheus-case-scope-label">What we built</p>
                  <p className="prometheus-case-description">{item.description}</p>
                </div>
                <div className="prometheus-case-footer">
                  <div className="prometheus-case-signature">
                    <p className="prometheus-case-name">{item.name}</p>
                    <p className="prometheus-case-category">{item.category}</p>
                    <a className="prometheus-case-live-link" href={item.liveUrl} target="_blank" rel="noopener noreferrer">View live website <span aria-hidden="true">↗</span></a>
                  </div>
                  <div className="prometheus-case-controls" aria-label={`${item.name} case navigation`}>
                    <span className="prometheus-case-counter">{String(index + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}</span>
                    <div className="prometheus-case-control-buttons">
                      {index > 0 ? <a href={`#case-${cases[index - 1].id}`} aria-label={`Previous case: ${cases[index - 1].name}`}><Arrow up /></a> : <button disabled aria-label="Previous case"><Arrow up /></button>}
                      {index < cases.length - 1 ? <a href={`#case-${cases[index + 1].id}`} aria-label={`Next case: ${cases[index + 1].name}`}><Arrow /></a> : <button disabled aria-label="Next case"><Arrow /></button>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="prometheus-case-gallery" aria-label={`${item.name} project gallery`}>
                {(item.screenshots ?? []).map((source, imageIndex) => (
                  <figure key={source} className={`prometheus-case-visual prometheus-case-screenshot-card is-${item.id}`}>
                    <div className={`prometheus-case-device${source.includes("-mobile") ? " is-mobile" : ""}`}>
                      <div className="prometheus-case-device-bar" aria-hidden="true"><i /><i /><i /><span>{item.name}</span></div>
                      <img src={source} alt={`${item.name}, ${source.includes("-mobile") ? "mobile" : "desktop"} website preview ${imageIndex + 1}`} className="prometheus-case-screenshot" />
                    </div>
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
