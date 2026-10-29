export type ShowcaseSheet = {
  id: string;
  title: string;
  tone: "paper" | "cream" | "teal" | "rose";
  image?: string;
};

const tones: ShowcaseSheet["tone"][] = ["paper", "cream", "paper", "teal", "paper", "rose"];

const titles = ["Nail Salon", "Hardware", "Virtual Office", "Barber Studio", "Inkco Print Studio", "Print Shop ERP", "SmileCare", "Prometheus 3D Portfolio", "Lendfolio", "Cordium", "Spectra", "Reve", "I Love Taguig ECS", "Wedding RSVP"];

export const blankShowcaseSheets: ShowcaseSheet[] = Array.from({ length: 14 }, (_, index) => ({
  id: `sheet-${String(index + 1).padStart(2, "0")}`,
  title: titles[index],
  tone: tones[index % tones.length],
}));

/** Fill the canonical fourteen slots without changing their identity or order. */
export function showcaseSheetsFromFiles(files: readonly string[]): ShowcaseSheet[] {
  const images = new Map<string, string>();
  for (const file of [...files].sort()) {
    if (!/^sheet-(0[1-9]|1[0-4])\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
    const id = file.slice(0, 8).toLowerCase();
    if (!images.has(id)) images.set(id, file);
  }
  return blankShowcaseSheets.map(sheet => ({
    ...sheet,
    image: images.has(sheet.id) ? `/showcase/${images.get(sheet.id)}` : undefined,
  }));
}
