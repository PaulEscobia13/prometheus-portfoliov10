import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { blankShowcaseSheets, type ShowcaseSheet } from "../content/showcase";
import ShowcaseGallery from "./ShowcaseGallery";

export default function ShowcaseSection() {
  const directory = join(process.cwd(), "public", "showcase");
  const files = existsSync(directory) ? readdirSync(directory).filter(file => /^sheet-(0[1-9]|1[0-6])\.(png|jpe?g|webp|avif)$/i.test(file)).sort() : [];
  const unique = new Map<string, string>();
  files.forEach(file => { if (!unique.has(file.slice(0, 8))) unique.set(file.slice(0, 8), file); });
  const sheets: ShowcaseSheet[] = unique.size >= 8
    ? Array.from(unique, ([id, file], index) => ({ id, title: `Concept ${id.slice(-2)}`, tone: blankShowcaseSheets[index % 12].tone, image: `/showcase/${file}` }))
    : blankShowcaseSheets.map(sheet => ({ ...sheet, image: unique.has(sheet.id) ? `/showcase/${unique.get(sheet.id)}` : undefined }));
  return <ShowcaseGallery sheets={sheets} />;
}
