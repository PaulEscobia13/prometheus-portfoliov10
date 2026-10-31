import { GeistSans } from "geist/font/sans";
import PricingPlans from "./PricingPlans";

export default function PricingSection() {
  return (
    <section id="pricing" className={`prometheus-pricing ${GeistSans.variable}`} aria-labelledby="pricing-title">
      <div className="pricing-container">
        <header className="pricing-intro">
          <h2 id="pricing-title"><em>Premium Experiences</em></h2>
          <p><strong>We help you get where you want to go.</strong></p>
        </header>

        <PricingPlans />

      </div>
    </section>
  );
}
