import { contact, footerLinks } from "../content/contact";
import FooterReveal from "./FooterReveal";

export default function FooterSection() {
  return (
    <FooterReveal>
      <div className="prometheus-footer-artboard">
        <div className="prometheus-footer-foreground">
          <div className="prometheus-footer-top"><span>PROMETHEUS</span><a href="#contact-actions">CONTACT US</a></div>
          <div className="prometheus-footer-main">
            <h2>Let’s build a system around how your business actually works.</h2>
            <p>Tell us where work becomes repetitive, fragmented, or difficult to keep track of. We’ll start there.</p>
          </div>
          <div className="prometheus-footer-lower" id="contact-actions">
            <a className="prometheus-footer-cta" href={contact.meetingUrl} target="_blank" rel="noopener noreferrer">{contact.meetingLabel} <span aria-hidden="true">↗</span></a>
            <nav className="prometheus-footer-links" aria-label="Footer navigation">
              {footerLinks.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}
            </nav>
          </div>
        </div>
        <div className="prometheus-footer-wordmark" aria-hidden="true">PROMETHEUS</div>
      </div>
    </FooterReveal>
  );
}
