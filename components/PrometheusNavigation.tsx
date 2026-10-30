"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

export default function PrometheusNavigation() {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [atPageEnd, setAtPageEnd] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbar = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 16);
      const faq = document.querySelector<HTMLElement>(".prometheus-faq");
      const navBottom = navbar.current?.getBoundingClientRect().bottom ?? 0;
      const faqBottom = faq?.getBoundingClientRect().bottom ?? Infinity;
      const style = faq ? window.getComputedStyle(faq) : null;
      const cornerHeight = Math.max(parseFloat(style?.borderBottomLeftRadius ?? "0") || 0, parseFloat(style?.borderBottomRightRadius ?? "0") || 0);
      // Remain translucent through FAQ content. Mask only its rounded bottom
      // edge as that curve enters the navbar, then blend after it clears.
      const maskingCorner = !!faq && faqBottom - cornerHeight <= navBottom;
      setFooterVisible(maskingCorner);
      const passed = Math.max(0, navBottom - faqBottom);
      const remaining = Math.max(0, document.documentElement.scrollHeight - window.innerHeight - window.scrollY);
      const cleared = maskingCorner && faqBottom <= navBottom;
      const fadeDistance = Math.max(1, Math.min(160, passed + remaining));
      const progress = cleared ? remaining <= 2 ? 1 : Math.min(1, passed / fadeDistance) : 0;
      navbar.current?.style.setProperty("--footer-nav-burgundy", `${progress * 100}%`);
      setAtPageEnd(cleared && remaining <= 2);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 991px)");
    const update = () => {
      setMobile(query.matches);
      setOpen(false);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (open) Array.from(menu.current?.querySelectorAll<HTMLElement>("a,button") ?? []).find(element => element.getClientRects().length > 0)?.focus({ preventScroll: true });
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !toggle.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <nav ref={navbar} aria-label="Main navigation" className="navbar prometheus-navbar" data-scrolled={scrolled} data-footer-visible={footerVisible} data-page-end={atPageEnd} data-menu-open={open} onKeyDown={event => {
      if (event.key === "Escape" && open) {
        closeMenu();
        toggle.current?.focus();
      }
    }}>
      <div className="container is-relative w-container">
        <div className="navbar_main prometheus-nav-inner">
          <a href="#top" onClick={closeMenu} aria-label="Prometheus home" className="navbar_logo-wrapper w-inline-block"><span className="prometheus-wordmark">prometheus</span></a>
          <div className="prometheus-nav-menu-shell" data-open={open}>
          <div id="prometheus-menu" ref={menu} className="prometheus-nav-links" data-open={open} inert={mobile && !open} data-lenis-prevent="">
            {links.map(link => <div className="prometheus-nav-item" key={link.label}>
              <div className="prometheus-nav-row">
                <a className="prometheus-nav-primary-link" href={link.href} onClick={closeMenu} aria-label={link.label}><span className="prometheus-nav-label-window" aria-hidden="true"><span className="prometheus-nav-label-roll"><span>{link.label}</span><span className="prometheus-nav-label-copy">{link.label}</span></span></span></a>
              </div>
            </div>)}
          </div>
          </div>
          <a href="#contacts" onClick={closeMenu} aria-label="Contacts" className="button-cta nav-cta w-inline-block">
            <span className="button_text">Contacts</span>
            <span className="button_arrow-wrapper-2"><span className="code-embed navbar_button-arrow w-embed"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H12M12 7L6.5 1.5M12 7L6.5 12.5" stroke="currentColor" strokeWidth="1.8" /></svg></span></span>
          </a>
          <button ref={toggle} type="button" className="prometheus-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="prometheus-menu" onClick={() => setOpen(value => !value)}>
            <span aria-hidden="true" className="prometheus-burger-line" />
            <span aria-hidden="true" className="prometheus-burger-line" />
          </button>
        </div>
      </div>
    </nav>
  );
}
