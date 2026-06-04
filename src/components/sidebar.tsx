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
  Pencil,
} from "lucide-react";
import { useState } from "react";

type ProfileBits = {
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
};

const NAV = [
  { href: "/", label: "Início", icon: Home, emoji: "🏡" },
  { href: "/diario", label: "Diário", icon: BookHeart, emoji: "📖" },
  { href: "/agenda", label: "Agenda", icon: CalendarHeart, emoji: "📅" },
  { href: "/configuracoes", label: "Ajustes", icon: Settings, emoji: "⚙️" },
];

export function Sidebar({ profile }: { profile: ProfileBits }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initial = (profile.displayName || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="md:hidden fixed top-3 left-3 z-40 p-2 rounded-full bg-[var(--card)] border-2 border-[var(--border)] shadow-[var(--shadow-soft)]"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "md:sticky md:top-0 md:h-screen md:w-72 md:flex md:flex-col md:p-5 md:gap-5 shrink-0",
          "fixed inset-0 z-30 md:z-auto md:relative md:inset-auto bg-[var(--bg)] md:bg-transparent p-6 gap-5 transition-transform overflow-y-auto",
          !open && "translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 px-2"
          onClick={() => setOpen(false)}
        >
          <Sparkles className="h-7 w-7 text-[var(--primary)] animate-float" />
          <span className="font-handwriting text-3xl text-[var(--primary)]">
            Diarinho
          </span>
        </Link>

        {/* Profile card */}
        <ProfileCard profile={profile} initial={initial} />

        {/* Navigation */}
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
                <span className="text-base" aria-hidden>
                  {item.emoji}
                </span>
                <Icon className="h-4 w-4 opacity-70" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Signout button — destaque para ficar nítido */}
        <form action="/auth/signout" method="post" className="mt-2">
          <button
            type="submit"
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              "bg-[color-mix(in_srgb,var(--danger)_12%,var(--card))]",
              "text-[var(--danger)]",
              "border-2 border-[color-mix(in_srgb,var(--danger)_30%,transparent)]",
              "hover:bg-[var(--danger)] hover:text-white hover:scale-[1.02] active:scale-[0.98]",
              "shadow-[0_4px_14px_-6px_color-mix(in_srgb,var(--danger)_50%,transparent)]",
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
            Sair
          </button>
        </form>
      </aside>
    </>
  );
}

function ProfileCard({
  profile,
  initial,
}: {
  profile: ProfileBits;
  initial: string;
}) {
  return (
    <div className="relative rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)] overflow-hidden">
      {/* decorative blob */}
      <span
        aria-hidden
        className="absolute -top-8 -right-8 h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="absolute -bottom-10 -left-6 h-20 w-20 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        <Link
          href="/configuracoes"
          className="group relative"
          aria-label="Editar perfil"
        >
          <div className="h-20 w-20 rounded-full border-4 border-[var(--primary)] overflow-hidden bg-[var(--muted)] shadow-[var(--shadow-soft)] flex items-center justify-center transition-transform group-hover:scale-105">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-handwriting text-4xl text-[var(--primary)]">
                {initial}
              </span>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shadow-[var(--shadow-soft)] opacity-0 group-hover:opacity-100 transition-opacity">
            <Pencil className="h-3.5 w-3.5" />
          </span>
        </Link>

        <p className="mt-3 font-bold text-base leading-tight truncate w-full">
          {profile.displayName}
        </p>

        {profile.bio ? (
          <p className="mt-1.5 text-[13px] font-handwriting text-[var(--muted-fg)] leading-snug px-1 line-clamp-3">
            “{profile.bio}”
          </p>
        ) : (
          <Link
            href="/configuracoes"
            className="mt-1.5 text-xs text-[var(--primary)] font-semibold hover:underline"
          >
            + adicionar uma bio
          </Link>
        )}
      </div>
    </div>
  );
}
