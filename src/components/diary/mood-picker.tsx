"use client";

import { cn } from "@/lib/utils";
import type { Mood } from "@/lib/database.types";

const MOODS: { key: Mood; label: string; emoji: string }[] = [
  { key: "feliz", label: "Feliz", emoji: "😊" },
  { key: "animado", label: "Animado", emoji: "🤩" },
  { key: "grato", label: "Grato", emoji: "🥹" },
  { key: "calmo", label: "Calmo", emoji: "😌" },
  { key: "neutro", label: "Neutro", emoji: "😐" },
  { key: "ansioso", label: "Ansioso", emoji: "😰" },
  { key: "triste", label: "Triste", emoji: "🥺" },
  { key: "irritado", label: "Irritado", emoji: "😤" },
];

export function MoodPicker({
  name = "mood",
  defaultValue,
}: {
  name?: string;
  defaultValue?: Mood | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <input type="hidden" name={name} id={`${name}-input`} defaultValue={defaultValue ?? ""} />
      {MOODS.map((m) => (
        <MoodButton key={m.key} mood={m} name={name} initial={defaultValue} />
      ))}
    </div>
  );
}

function MoodButton({
  mood,
  name,
  initial,
}: {
  mood: { key: Mood; label: string; emoji: string };
  name: string;
  initial?: Mood | null;
}) {
  return (
    <button
      type="button"
      data-mood={mood.key}
      onClick={(e) => {
        const wrap = e.currentTarget.parentElement!;
        const hidden = wrap.querySelector<HTMLInputElement>(`#${name}-input`)!;
        const wasActive = hidden.value === mood.key;
        hidden.value = wasActive ? "" : mood.key;
        wrap.querySelectorAll<HTMLButtonElement>("[data-mood]").forEach((b) => {
          const active = b.getAttribute("data-mood") === hidden.value;
          b.dataset.active = active ? "true" : "false";
        });
      }}
      data-active={initial === mood.key ? "true" : "false"}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-full border-2 text-sm transition-all hover:scale-105",
        "data-[active=true]:bg-[var(--primary)] data-[active=true]:text-[var(--primary-fg)] data-[active=true]:border-[var(--primary)]",
        "data-[active=false]:bg-[var(--card)] data-[active=false]:border-[var(--border)]",
      )}
    >
      <span>{mood.emoji}</span>
      <span>{mood.label}</span>
    </button>
  );
}
