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
    <div className="relative rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] p-5 pt-6 shadow-[var(--shadow-soft)] overflow-hidden">
      {/* decorative blobs */}
      <span
        aria-hidden
        className="absolute -top-10 -right-10 h-32 w-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        <Link
          href="/configuracoes"
          className="group relative inline-block"
          aria-label="Editar perfil"
        >
          {/* Corner decorations */}
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 -translate-x-1/2 text-2xl animate-float select-none z-10"
            style={{ animationDelay: "0s" }}
          >
            🎀
          </span>
          <span
            aria-hidden
            className="absolute top-2 -left-3 text-lg rotate-[-18deg] animate-float select-none"
            style={{ animationDelay: "0.4s" }}
          >
            🌸
          </span>
          <span
            aria-hidden
            className="absolute top-2 -right-3 text-lg rotate-[18deg] animate-float select-none"
            style={{ animationDelay: "0.8s" }}
          >
            🌸
          </span>
          <span
            aria-hidden
            className="absolute -bottom-2 -left-2 text-base animate-float select-none"
            style={{ animationDelay: "1.2s" }}
          >
            💐
          </span>
          <span
            aria-hidden
            className="absolute -bottom-2 -right-2 text-base animate-float select-none"
            style={{ animationDelay: "1.6s" }}
          >
            💐
          </span>

          {/* Outer rotating gradient frame */}
          <div className="avatar-frame h-36 w-36 md:h-40 md:w-40 rounded-full p-[4px] shadow-[var(--shadow-soft)] transition-transform group-hover:scale-105">
            {/* White inner ring */}
            <div className="h-full w-full rounded-full bg-[var(--card)] p-[5px]">
              {/* Photo */}
              <div className="h-full w-full rounded-full overflow-hidden bg-[var(--muted)] flex items-center justify-center">
                {profile.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-handwriting text-7xl md:text-8xl text-[var(--primary)] leading-none">
                    {initial}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Edit pencil on hover */}
          <span className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] flex items-center justify-center shadow-[var(--shadow-soft)] opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 z-10">
            <Pencil className="h-4 w-4" />
          </span>
        </Link>

        <p className="mt-5 font-bold text-lg leading-tight truncate w-full px-1">
          {profile.displayName}
        </p>

        {profile.bio ? (
          <p className="mt-2 font-handwriting text-xl md:text-2xl text-[var(--card-fg)]/85 leading-snug px-1 line-clamp-4">
            “{profile.bio}”
          </p>
        ) : (
          <Link
            href="/configuracoes"
            className="mt-2 text-sm text-[var(--primary)] font-semibold hover:underline"
          >
            + adicionar uma bio
          </Link>
        )}
      </div>
    </div>
  );
}
