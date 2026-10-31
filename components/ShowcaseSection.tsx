import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { showcaseSheetsFromFiles } from "../content/showcase";
import WebflowShowcaseGallery from "./WebflowShowcaseGallery";

export default function ShowcaseSection() {
  const directory = join(process.cwd(), "public", "showcase");
  const files = existsSync(directory) ? readdirSync(directory, { withFileTypes: true }).filter(file => file.isFile()).map(file => file.name) : [];
  // Assets fill the fourteen curated slots; a partial collection must never
  // change the cycle length or discard the remaining placeholder cards.
  const sheets = showcaseSheetsFromFiles(files);
  return <WebflowShowcaseGallery sheets={sheets} />;
}
