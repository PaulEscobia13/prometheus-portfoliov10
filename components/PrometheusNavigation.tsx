"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Works", href: "#works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
] as const;

export default function PrometheusNavigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [open]);

  return (
    <nav aria-label="Main navigation" className="navbar prometheus-navbar" onKeyDown={event => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }}>
      <div className="container is-relative w-container">
        <div className="navbar_main prometheus-nav-inner">
          <a href="/prometheus" aria-label="Prometheus home" className="navbar_logo-wrapper w-inline-block"><span className="prometheus-wordmark">prometheus</span></a>
          <div id="prometheus-menu" ref={menu} className="prometheus-nav-links" data-open={open}>
            {links.map(link => <a key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          </div>
          <a href="#contacts" onClick={() => setOpen(false)} className="button-cta nav-cta w-inline-block">
            <span className="button_text">Contacts</span>
            <span className="button_arrow-wrapper-2"><span className="code-embed navbar_button-arrow w-embed"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 7H12M12 7L6.5 1.5M12 7L6.5 12.5" stroke="currentColor" strokeWidth="1.8" /></svg></span></span>
          </a>
          <button ref={toggle} type="button" className="prometheus-menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="prometheus-menu" onClick={() => setOpen(value => !value)}>
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
