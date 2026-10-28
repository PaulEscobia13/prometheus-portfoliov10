import { readFileSync } from "node:fs";
import { join } from "node:path";
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Hero() {
 const html = readFileSync(join(process.cwd(), "reference/hero.html"), "utf8");
 return <div dangerouslySetInnerHTML={{__html:html}} />;
}
