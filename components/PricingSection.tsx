import { GeistSans } from "geist/font/sans";
import { pricingPlans } from "../content/pricing";
import { PricingAudienceSelector } from "./PricingSelector";

export default function PricingSection() {
  return (
    <section id="pricing" className={`prometheus-pricing ${GeistSans.variable}`} aria-labelledby="pricing-title">
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title"><em>Premium Experiences</em></h2>
          <p><strong>We help you get where you want to go.</strong></p>
        </header>

        <PricingAudienceSelector />
        <div className="pricing-plans">
          {pricingPlans.map(plan => (
            <article key={plan.id} className={`pricing-plan${plan.featured ? " pricing-plan-featured" : ""}`} aria-labelledby={`pricing-${plan.id}-title`}>
              <h3 id={`pricing-${plan.id}-title`} className="pricing-plan-name">{plan.name}</h3>
              <p className="pricing-plan-price">
                <span data-price={plan.price}>{plan.price}</span>
                {plan.unit && <span className="pricing-plan-unit">{plan.unit}</span>}
              </p>
              <p className="pricing-plan-description">{plan.description}</p>
              <a className="pricing-plan-action" href="#contacts" aria-label={`${plan.action}: ${plan.name} plan`}>{plan.action}</a>
              <div className="pricing-plan-included">
                <p>What’s Included</p>
                <div className="pricing-build-first">We build it first for free, no payment.</div>
                <ul>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={feature}>
                      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><defs><mask id={`pricing-check-${plan.id}-${featureIndex}`}><rect width="20" height="20" fill="white" /><path d="m5.5 10 3 3 6-6" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></mask></defs><circle cx="10" cy="10" r="9" fill="currentColor" mask={`url(#pricing-check-${plan.id}-${featureIndex})`} /></svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
