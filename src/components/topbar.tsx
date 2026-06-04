"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function TopBar({ displayName }: { displayName: string }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[var(--bg)]/70 border-b-2 border-[var(--border)]/60">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--primary)] animate-float" />
            <span className="font-handwriting text-2xl text-[var(--primary)]">
              Diarinho
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-[var(--muted-fg)]">Oi,</span>
          <span className="font-bold">{displayName}</span>
          <span className="text-xl animate-wiggle inline-block">💖</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-semibold text-[var(--muted-fg)] uppercase tracking-wide">
            Tema
          </span>
          <ThemeSwitcher compact />
        </div>
      </div>
    </header>
  );
}
