import { readFileSync } from "node:fs";
import { join } from "node:path";
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Navigation({ brand = "arounda" }: { brand?: "arounda" | "prometheus" }) {
 let html = readFileSync(join(process.cwd(), "reference/navigation.html"), "utf8");
 if (brand === "prometheus") {
   html = html.replace(
     /<a\b[^>]*class="[^"]*navbar_logo-wrapper[^>]*>[\s\S]*?<\/a>/,
     '<a href="/prometheus" aria-label="Prometheus home" class="navbar_logo-wrapper w-inline-block"><span class="prometheus-wordmark">prometheus</span></a>'
   );
 }
 return <div dangerouslySetInnerHTML={{__html:html}} />;
}
