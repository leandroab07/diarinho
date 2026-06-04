"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PAPER_STYLES } from "@/lib/paper-styles";
import type { PaperStyle } from "@/lib/database.types";

export function PaperPicker({
  name = "paper_style",
  defaultValue = "plain",
}: {
  name?: string;
  defaultValue?: PaperStyle | null;
}) {
  const initial = (defaultValue ?? "plain") as PaperStyle;
  const [active, setActive] = useState<PaperStyle>(initial);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={active} />
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {PAPER_STYLES.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setActive(p.key)}
            className={cn(
              "rounded-2xl border-2 p-1 transition-all hover:scale-105",
              active === p.key
                ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                : "border-[var(--border)]",
            )}
            title={p.name}
            aria-label={`Estilo ${p.name}`}
            aria-pressed={active === p.key}
          >
            <div
              className={cn(
                "rounded-xl overflow-hidden h-10",
                "paper-preview",
                p.className,
              )}
            />
            <p className="text-[10px] font-semibold mt-1 text-center">
              {p.emoji} {p.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
