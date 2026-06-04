"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BookHeart,
  CalendarHeart,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Início", icon: Home, emoji: "🏡" },
  { href: "/diario", label: "Diário", icon: BookHeart, emoji: "📖" },
  { href: "/agenda", label: "Agenda", icon: CalendarHeart, emoji: "📅" },
  { href: "/configuracoes", label: "Ajustes", icon: Settings, emoji: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button (floats top-left, complements the sticky TopBar) */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden fixed top-3 left-3 z-40 p-2 rounded-full bg-[var(--card)] border-2 border-[var(--border)] shadow-[var(--shadow-soft)]"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "md:sticky md:top-0 md:h-screen md:w-64 md:flex md:flex-col md:p-6 md:gap-6 shrink-0",
          "fixed inset-0 z-30 md:z-auto md:relative md:inset-auto bg-[var(--bg)] md:bg-transparent p-6 gap-6 transition-transform",
          !open && "translate-x-full md:translate-x-0",
        )}
      >
        <Link
          href="/"
          className="hidden md:flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <Sparkles className="h-7 w-7 text-[var(--primary)] animate-float" />
          <span className="font-handwriting text-3xl text-[var(--primary)]">
            Diarinho
          </span>
        </Link>

        <nav className="flex flex-col gap-1 flex-1 mt-4 md:mt-0">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all",
                  active
                    ? "bg-[var(--primary)] text-[var(--primary-fg)] shadow-[var(--shadow-soft)]"
                    : "text-[var(--card-fg)] hover:bg-[var(--muted)]",
                )}
              >
                <span className="text-base" aria-hidden>
                  {item.emoji}
                </span>
                <Icon className="h-4 w-4 opacity-70" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[var(--card-fg)] hover:bg-[var(--muted)] transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}
