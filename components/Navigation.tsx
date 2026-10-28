import { readFileSync } from "node:fs";
import { join } from "node:path";
import PrometheusNavigation from "./PrometheusNavigation";
// Captured markup retained for baseline calibration; not the finished React implementation.
export default function Navigation({ brand = "arounda" }: { brand?: "arounda" | "prometheus" }) {
 if (brand === "prometheus") return <PrometheusNavigation />;
 const html = readFileSync(join(process.cwd(), "reference/navigation.html"), "utf8");
 return <div dangerouslySetInnerHTML={{__html:html}} />;
}
