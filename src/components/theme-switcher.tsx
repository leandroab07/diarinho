"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { THEMES, THEME_LABELS, cn } from "@/lib/utils";
import { useState } from "react";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [wiggle, setWiggle] = useState<string | null>(null);

  return (
    <div className={cn("flex gap-2", compact && "gap-1")}>
      {THEMES.map((t) => {
        const meta = THEME_LABELS[t];
        const active = theme === t;
        return (
          <button
            key={t}
            type="button"
            title={meta.name}
            onClick={() => {
              setTheme(t);
              setWiggle(t);
              setTimeout(() => setWiggle(null), 600);
            }}
            className={cn(
              "relative rounded-full border-2 transition-all duration-200 flex items-center justify-center",
              compact ? "h-9 w-9 text-base" : "h-11 w-11 text-xl",
              active
                ? "border-[var(--primary)] bg-[var(--card)] shadow-[var(--shadow-soft)] scale-110"
                : "border-[var(--border)] bg-[var(--muted)] hover:scale-105",
              wiggle === t && "animate-wiggle",
            )}
            aria-label={`Tema ${meta.name}`}
          >
            <span aria-hidden>{meta.emoji}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ThemeSwitcherInline() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {THEMES.map((t) => {
        const meta = THEME_LABELS[t];
        const active = theme === t;
        return (
          <Button
            key={t}
            variant={active ? "default" : "outline"}
            onClick={() => setTheme(t)}
            className="flex-col h-auto py-4 gap-2"
          >
            <span className="text-2xl">{meta.emoji}</span>
            <span className="text-xs">{meta.name}</span>
          </Button>
        );
      })}
    </div>
  );
}
