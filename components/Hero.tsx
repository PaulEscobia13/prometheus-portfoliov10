import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prometheusHero } from "../content/prometheusHero";

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Hero({ brand = "arounda" }: { brand?: "arounda" | "prometheus" }) {
 let html = readFileSync(join(process.cwd(), "reference/hero.html"), "utf8");
 if (brand === "prometheus") {
   html = html.replace(/<h1 class="home-hero-subtitle">[\s\S]*?<\/h1>/,
     `<p class="home-hero-subtitle">${escapeHtml(prometheusHero.eyebrow)}</p>`);
   const headline = prometheusHero.headline.map(part => {
     const text = escapeHtml(part.text);
     if ("pill" in part) return `<a href="#services" class="homepage-h1-link ${part.pill}">${text}</a>`;
     if ("italic" in part) return `<em class="home-hero_h1-word-purple">${text}</em>`;
     return text;
   }).join("");
   html = html.replace(/<div class="homepage_h1-wrapper">[\s\S]*?(?=<div class="home-hero_icons-wrapper">)/,
     `<div class="homepage_h1-wrapper"><h1 class="home-hero_h1 prometheus-hero-title">${headline}</h1>`);
   prometheusHero.paragraphs.forEach((text, index) => {
     html = html.replace(new RegExp(`<p class="home-hero-quote_text home-hero-quote_text-${index + 1}">[\\s\\S]*?<\\/p>`),
       `<p class="home-hero-quote_text home-hero-quote_text-${index + 1}">${escapeHtml(text)}</p>`);
   });
   const tags = prometheusHero.tags.map(text => `<a href="#services" class="link-white-text w-inline-block"><span class="hero_title-tag home-hero-tag">${escapeHtml(text)}</span></a>`).join("");
   html = html.replace(/<a\b[^>]*href="https:\/\/arounda.agency\/industries\/(saas|ai|web3)"[^>]*>[\s\S]*?<\/a>/g,
     (_, industry: string) => industry === "saas" ? tags : "");
   const partners = [
     { file: "furniture-odyssey-original.png", neutral: "furniture_odyssey_fff4ea.png", name: "Furniture Odyssey" },
     { file: "piercing-corner-original.png", neutral: "piercing_corner_fff4ea.png", name: "Piercing Corner" },
   ];
   html = html.replace(
     /<div class="trusted_logos">[\s\S]*?<\/div>/,
     `<div class="trusted_logos prometheus-partners">${partners.map(({ file, neutral, name }) =>
       `<div class="prometheus-partner" role="img" aria-label="${name}" tabindex="0"><img src="/partners/${neutral}" alt="" aria-hidden="true" class="prometheus-partner-logo prometheus-partner-neutral" loading="eager" decoding="async"><img src="/partners/${file}" alt="" aria-hidden="true" class="prometheus-partner-logo prometheus-partner-color" loading="eager" decoding="async"></div>`
     ).join("")}</div>`
   );
   html = html.replace("Partnering with enterprise platforms across global markets", "Trusted by our clients");
   // Preserve the captured icon silhouettes while letting the theme set their color.
   html = html.replace(/<img\b[^>]*class="home-hero_h1-icon ([^"]+)"[^>]*>/g, (tag, variant: string) => {
     const source = tag.match(/src="([^"]+)"/)?.[1];
     if (!source) return tag;
     return `<span aria-hidden="true" class="home-hero_h1-icon ${variant}"><span class="prometheus-icon-glyph" style="mask-image:url('${source}')"></span></span>`;
   });
 }
 return <div dangerouslySetInnerHTML={{__html:html}} />;
}
