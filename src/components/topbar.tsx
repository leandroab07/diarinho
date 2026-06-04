"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function TopBar({ displayName }: { displayName: string }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[var(--bg)]/75 border-b-2 border-[var(--border)]/60">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo — sempre visível, clicável → home */}
        <Link
          href="/"
          className="flex items-center gap-2 group ml-12 md:ml-0"
          aria-label="Início"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--primary)]/15 group-hover:bg-[var(--primary)]/25 transition-colors">
            <Sparkles className="h-5 w-5 text-[var(--primary)] animate-float" />
          </span>
          <span className="font-handwriting text-2xl md:text-3xl text-[var(--primary)] leading-none group-hover:scale-105 transition-transform">
            Diarinho
          </span>
        </Link>

        {/* Nome do usuário também volta pra home */}
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
        >
          <span className="text-[var(--muted-fg)]">Oi,</span>
          <span className="font-bold">{displayName}</span>
          <span className="text-xl animate-wiggle inline-block">💖</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-xs font-semibold text-[var(--muted-fg)] uppercase tracking-wide">
            Tema
          </span>
          <ThemeSwitcher compact />
        </div>
      </div>
    </header>
  );
}
