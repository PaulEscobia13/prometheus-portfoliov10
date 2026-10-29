import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { showcaseSheetsFromFiles } from "../content/showcase";

export function getShowcaseSheets() {
  const directory = join(process.cwd(), "public", "showcase");
  const files = existsSync(directory) ? readdirSync(directory, { withFileTypes: true }).filter(file => file.isFile()).map(file => file.name) : [];
  return showcaseSheetsFromFiles(files);
}
