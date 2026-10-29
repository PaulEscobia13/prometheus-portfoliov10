import { GeistSans } from "geist/font/sans";
import { pricingPlans } from "../content/pricing";

export default function PricingSection() {
  return (
    <section id="pricing" className={`prometheus-pricing ${GeistSans.variable}`} aria-labelledby="pricing-title">
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title"><em>Premium Experiences</em></h2>
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
              <a className="pricing-plan-action" href="#contacts" aria-label={`${plan.action}: ${plan.name} plan`}>{plan.action}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
