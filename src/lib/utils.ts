import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const THEMES = ["pink", "mint", "neon", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, { name: string; emoji: string }> = {
  pink: { name: "Rosa pastel", emoji: "🌸" },
  mint: { name: "Menta", emoji: "🌿" },
  neon: { name: "Neon noturno", emoji: "🌙" },
  dark: { name: "Dark aconchego", emoji: "🌃" },
};
