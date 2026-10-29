import { frequentlyAskedQuestions } from "../content/faq";
import FAQItem from "./FAQItem";

export default function FAQSection() {
  return (
    <section id="faq" className="prometheus-faq" aria-labelledby="faq-title">
      <div className="prometheus-faq-container">
        <header className="prometheus-faq-header">
          <h2 id="faq-title">FAQs</h2>
          <nav className="prometheus-faq-socials" aria-label="Prometheus social media">
            <a href="https://www.facebook.com/profile.php?id=61593771133079" target="_blank" rel="noopener noreferrer" aria-label="Prometheus on Facebook">
              <span className="prometheus-faq-social-icon is-facebook" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/prometheus.exps/" target="_blank" rel="noopener noreferrer" aria-label="Prometheus on Instagram">
              <span className="prometheus-faq-social-icon is-instagram" aria-hidden="true" />
            </a>
          </nav>
        </header>
        <div className="prometheus-faq-list">
          {frequentlyAskedQuestions.map(item => <FAQItem key={item.id} {...item} />)}
        </div>
      </div>
    </section>
  );
}
