import { GeistSans } from "geist/font/sans";
import { pricingPlans } from "../content/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className={`prometheus-pricing ${GeistSans.variable}`} aria-labelledby="pricing-title">
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title">Simple pricing that<br />scales with you.</h2>
          <p>Choose a plan that fits your stage and scope, with no surprises and no hidden fees.</p>
        </header>

        <div className="pricing-plans">
          {pricingPlans.map(plan => (
            <article key={plan.id} className={`pricing-plan${plan.featured ? " pricing-plan-featured" : ""}`} aria-labelledby={`pricing-${plan.id}-title`}>
              <h3 id={`pricing-${plan.id}-title`} className="pricing-plan-name">{plan.name}</h3>
              <p className="pricing-plan-price">
                <span>{plan.price}</span>
                {plan.unit && <span className="pricing-plan-unit">{plan.unit}</span>}
              </p>
              <p className="pricing-plan-description">{plan.description}</p>
              <a className="pricing-plan-action" href="#contacts" aria-label={`${plan.action}: ${plan.name} plan`}>{plan.action}</a>
              <div className="pricing-plan-included">
                <p>What’s Included</p>
                <ul>
                  {plan.features.map(feature => (
                    <li key={feature}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true"><path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
