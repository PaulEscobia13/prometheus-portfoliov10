import { readFileSync } from "node:fs";
import { join } from "node:path";
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Hero({ brand = "arounda" }: { brand?: "arounda" | "prometheus" }) {
 let html = readFileSync(join(process.cwd(), "reference/hero.html"), "utf8");
 if (brand === "prometheus") {
   const partners = [
     { file: "furniture_odyssey_fff4ea.png", name: "Furniture Odyssey" },
     { file: "piercing_corner_fff4ea.png", name: "Piercing Corner" },
   ];
   html = html.replace(
     /<div class="trusted_logos">[\s\S]*?<\/div>/,
     `<div class="trusted_logos prometheus-partners">${partners.map(({ file, name }) =>
       `<div class="prometheus-partner"><img src="/partners/${file}" alt="${name}" class="prometheus-partner-logo" loading="eager" decoding="async"></div>`
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
