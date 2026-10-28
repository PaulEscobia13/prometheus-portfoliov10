export type ShowcaseSheet = {
  id: string;
  title: string;
  tone: "paper" | "cream" | "teal" | "rose";
  image?: string;
};

const tones: ShowcaseSheet["tone"][] = ["paper", "cream", "paper", "teal", "paper", "rose"];

export const blankShowcaseSheets: ShowcaseSheet[] = Array.from({ length: 12 }, (_, index) => ({
  id: `sheet-${String(index + 1).padStart(2, "0")}`,
  title: `Concept ${String(index + 1).padStart(2, "0")}`,
  tone: tones[index % tones.length],
}));

/** Fill the canonical twelve slots without changing their identity or order. */
export function showcaseSheetsFromFiles(files: readonly string[]): ShowcaseSheet[] {
  const images = new Map<string, string>();
  for (const file of [...files].sort()) {
    if (!/^sheet-(0[1-9]|1[0-2])\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
    const id = file.slice(0, 8).toLowerCase();
    if (!images.has(id)) images.set(id, file);
  }
  return blankShowcaseSheets.map(sheet => ({
    ...sheet,
    image: images.has(sheet.id) ? `/showcase/${images.get(sheet.id)}` : undefined,
  }));
}
