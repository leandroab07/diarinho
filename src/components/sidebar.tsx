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
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Início", icon: Home },
  { href: "/diario", label: "Diário", icon: BookHeart },
  { href: "/agenda", label: "Agenda", icon: CalendarHeart },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
];

export function Sidebar({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-[var(--card)]/80 backdrop-blur border-b-2 border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--primary)] animate-float" />
          <span className="font-handwriting text-2xl text-[var(--primary)]">
            Diarinho
          </span>
        </Link>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 rounded-full hover:bg-[var(--muted)]"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "md:sticky md:top-0 md:h-screen md:w-72 md:flex md:flex-col md:p-6 md:gap-6 shrink-0",
          "fixed inset-0 z-40 md:z-auto md:relative md:inset-auto bg-[var(--bg)] md:bg-transparent p-6 gap-6 transition-transform",
          !open && "translate-x-full md:translate-x-0",
        )}
      >
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-[var(--primary)] animate-float" />
          <span className="font-handwriting text-3xl text-[var(--primary)]">
            Diarinho
          </span>
        </div>

        <div className="rounded-3xl bg-[var(--card)] border-2 border-[var(--border)] p-4 shadow-[var(--shadow-soft)]">
          <p className="text-xs text-[var(--muted-fg)]">Oi,</p>
          <p className="font-bold text-lg truncate">{displayName}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
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
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-4">
          <div className="rounded-3xl bg-[var(--card)] border-2 border-[var(--border)] p-3">
            <p className="text-xs font-semibold text-[var(--muted-fg)] mb-2 px-1">
              Tema
            </p>
            <ThemeSwitcher compact />
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[var(--card-fg)] hover:bg-[var(--muted)] transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
