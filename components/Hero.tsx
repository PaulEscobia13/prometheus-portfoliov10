import { readFileSync } from "node:fs";
import { join } from "node:path";
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Hero({ brand = "arounda" }: { brand?: "arounda" | "prometheus" }) {
 let html = readFileSync(join(process.cwd(), "reference/hero.html"), "utf8");
 if (brand === "prometheus") {
   // Preserve the captured icon silhouettes while letting the theme set their color.
   html = html.replace(/<img\b[^>]*class="home-hero_h1-icon ([^"]+)"[^>]*>/g, (tag, variant: string) => {
     const source = tag.match(/src="([^"]+)"/)?.[1];
     if (!source) return tag;
     return `<span aria-hidden="true" class="home-hero_h1-icon ${variant}"><span class="prometheus-icon-glyph" style="mask-image:url('${source}')"></span></span>`;
   });
 }
 return <div dangerouslySetInnerHTML={{__html:html}} />;
}
