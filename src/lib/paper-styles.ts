import type { PaperStyle } from "@/lib/database.types";

export const PAPER_STYLES: {
  key: PaperStyle;
  name: string;
  emoji: string;
  className: string;
}[] = [
  { key: "plain",     name: "Liso",         emoji: "📄", className: "paper-plain" },
  { key: "lined",     name: "Pautado",      emoji: "📝", className: "paper-lined" },
  { key: "grid",      name: "Quadriculado", emoji: "🔳", className: "paper-grid" },
  { key: "dotted",    name: "Pontilhado",   emoji: "⋯",  className: "paper-dotted" },
  { key: "margin",    name: "Com margem",   emoji: "📋", className: "paper-margin" },
  { key: "parchment", name: "Pergaminho",   emoji: "📜", className: "paper-parchment" },
];

export function paperClass(style: PaperStyle | null | undefined): string {
  const found = PAPER_STYLES.find((p) => p.key === (style ?? "plain"));
  return found?.className ?? "paper-plain";
}
