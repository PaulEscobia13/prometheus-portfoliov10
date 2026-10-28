import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { showcaseSheetsFromFiles } from "../content/showcase";
import ShowcaseGallery from "./ShowcaseGallery";

export default function ShowcaseSection() {
  const directory = join(process.cwd(), "public", "showcase");
  const files = existsSync(directory) ? readdirSync(directory, { withFileTypes: true }).filter(file => file.isFile()).map(file => file.name) : [];
  // Assets fill existing slots; installing a partial collection must never
  // change the cycle length or discard the remaining placeholder cards.
  const sheets = showcaseSheetsFromFiles(files);
  return <ShowcaseGallery sheets={sheets} />;
}
