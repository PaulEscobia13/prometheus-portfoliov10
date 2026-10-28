import { existsSync } from "node:fs";
import { join } from "node:path";
import { caseStudies } from "../content/caseStudies";
import CaseStudies from "./CaseStudies";

export default function CaseStudySection() {
  const cases = caseStudies.map(item => {
    const screenshot = `/cases/${item.id}.png`;
    return { ...item, screenshot: existsSync(join(process.cwd(), "public", screenshot)) ? screenshot : undefined };
  });
  return <CaseStudies cases={cases} />;
}
