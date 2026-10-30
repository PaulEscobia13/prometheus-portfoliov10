import { GeistSans } from "geist/font/sans";
import { pricingPlans } from "../content/pricing";
import { contact } from "../content/contact";
import PricingReveal from "./PricingReveal";

export default function PricingSection() {
  return (
    <div className="pricing-reveal-backdrop">
      <PricingReveal className={GeistSans.variable}>
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title"><em>Get a Premium Experience<br />at a Discounted Rate.</em></h2>
          <p><strong>We’ll help you find the product you’re looking for.</strong></p>
        </header>

        <div className="pricing-plans">
          {pricingPlans.map(plan => (
            <article key={plan.id} className={`pricing-plan${plan.featured ? " pricing-plan-featured" : ""}`} aria-labelledby={`pricing-${plan.id}-title`}>
              <h3 id={`pricing-${plan.id}-title`} className="pricing-plan-name">{plan.name}</h3>
              <p className="pricing-plan-price">
                <span data-price={plan.price}>{plan.price}</span>
                {plan.unit && <span className="pricing-plan-unit">{plan.unit}</span>}
              </p>
              <p className="pricing-plan-description">{plan.description}</p>
              <ul className="pricing-plan-features" aria-label={`${plan.name} features`}>
                {plan.features.map(feature => (
                  <li key={feature}>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a className="pricing-plan-action" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer" aria-label={`${plan.action}: ${plan.name} plan`}>{plan.action}</a>
            </article>
          ))}
        </div>
        <aside className="pricing-early-rate-note" aria-label="Early-client pricing">
          <strong>Discounted rates for our <span>first 5 clients.</span></strong>
          <p>From planning to launch, we’ll be with you every step of the way.</p>
        </aside>
      </div>
      </PricingReveal>
    </div>
  );
}
