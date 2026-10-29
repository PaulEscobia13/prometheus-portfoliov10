import { GeistSans } from "geist/font/sans";
import { pricingPlans } from "../content/pricing";
import PricingReveal from "./PricingReveal";

export default function PricingSection() {
  return (
    <div className="pricing-reveal-backdrop">
      <PricingReveal className={GeistSans.variable}>
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title"><em>Get a Premium Experience<br />at a Discounted Rate.</em></h2>
          <p><strong>We help you get where you want to go.</strong></p>
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
              <a className="pricing-plan-action" href="#contacts" aria-label={`${plan.action}: ${plan.name} plan`}>{plan.action}</a>
            </article>
          ))}
        </div>
        <p className="pricing-early-rate-note">Discounted rates for our first 5 clients. From planning to launch, we’ll be with you every step of the way.</p>
      </div>
      </PricingReveal>
    </div>
  );
}
