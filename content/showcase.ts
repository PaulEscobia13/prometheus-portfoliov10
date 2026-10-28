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
