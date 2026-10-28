import { existsSync } from "node:fs";
import { join } from "node:path";
import { caseStudies } from "../content/caseStudies";
import CaseStudies from "./CaseStudies";

export default function CaseStudySection() {
  const cases = caseStudies.map(item => {
    const screenshots = ["", "-2", "-3", "-mobile"]
      .map(suffix => `/cases/${item.id}${suffix}.png`)
      .filter(source => existsSync(join(process.cwd(), "public", source)));
    return { ...item, screenshots };
  });
  return <CaseStudies cases={cases} />;
}
