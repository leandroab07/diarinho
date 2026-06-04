"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/* ─── SVG flowers ──────────────────────────────────────────────────────── */

function Daisy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="d-petal" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#ffe1ec" />
        </radialGradient>
        <radialGradient id="d-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd54f" />
          <stop offset="100%" stopColor="#f5a623" />
        </radialGradient>
      </defs>
      <g>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <ellipse
            key={angle}
            cx="50"
            cy="22"
            rx="11"
            ry="22"
            fill="url(#d-petal)"
            stroke="#f8c3d3"
            strokeWidth="1.2"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="11" fill="url(#d-core)" />
        <circle cx="46" cy="47" r="2.5" fill="#fff8d8" opacity="0.7" />
      </g>
    </svg>
  );
}

function Tulip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="t-bloom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff8fb8" />
          <stop offset="100%" stopColor="#d44e7a" />
        </linearGradient>
        <linearGradient id="t-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8fd0a3" />
          <stop offset="100%" stopColor="#4fa37b" />
        </linearGradient>
      </defs>
      <path
        d="M50 12 C 64 18 70 38 60 50 L 40 50 C 30 38 36 18 50 12 Z"
        fill="url(#t-bloom)"
      />
      <path
        d="M50 12 C 48 22 49 38 50 50"
        stroke="#a8264a"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />
      <path d="M50 50 L50 90" stroke="#4fa37b" strokeWidth="3" />
      <path
        d="M50 70 C 35 65 28 78 32 86 C 40 82 48 75 50 70 Z"
        fill="url(#t-leaf)"
      />
    </svg>
  );
}

function HeartGlow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="h-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffd4e0" />
          <stop offset="60%" stopColor="#ff7eb1" />
          <stop offset="100%" stopColor="#c44e85" />
        </radialGradient>
      </defs>
      <path
        d="M50 86 C 18 64 8 44 22 28 C 32 18 46 22 50 34 C 54 22 68 18 78 28 C 92 44 82 64 50 86 Z"
        fill="url(#h-grad)"
        stroke="#a23766"
        strokeWidth="1.5"
      />
      <circle cx="34" cy="36" r="6" fill="#fff" opacity="0.5" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="s-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="40%" stopColor="#ffe4f1" />
          <stop offset="100%" stopColor="#ec88a3" />
        </radialGradient>
      </defs>
      <path
        d="M50 10 L56 44 L90 50 L56 56 L50 90 L44 56 L10 50 L44 44 Z"
        fill="url(#s-grad)"
      />
      <circle cx="50" cy="50" r="6" fill="#fff" />
    </svg>
  );
}

function Cherry({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id="c-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="40%" stopColor="#ffb1c8" />
          <stop offset="100%" stopColor="#e94e7d" />
        </radialGradient>
      </defs>
      <g>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="50"
            cy="28"
            rx="14"
            ry="20"
            fill="url(#c-grad)"
            stroke="#c93668"
            strokeWidth="1"
            transform={`rotate(${a} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="8" fill="#fff8c2" />
        <circle cx="50" cy="50" r="3" fill="#f5a623" />
      </g>
    </svg>
  );
}

/* ─── Decoration meta ──────────────────────────────────────────────────── */

type Decoration = {
  /** kind: SVG component name OR emoji string */
  kind:
    | "daisy"
    | "tulip"
    | "heart"
    | "sparkle"
    | "cherry"
    | string;
  /** css positioning */
  style: React.CSSProperties;
  /** how big */
  size: string;
  /** animation delay */
  delay: number;
  /** continuous animation: bloom-float | sway | orbit | none */
  anim?: "float" | "sway" | "spin" | "drift";
};

// Placed on the OUTSIDE margins so they don't block content clicks.
// On desktop the content has max-w-5xl centered → a lot of side gutter.
const LEFT_SIDE: Decoration[] = [
  { kind: "daisy",  style: { top: "6%",  left: "1.5%" }, size: "76px", delay: 0.0, anim: "sway" },
  { kind: "🌷",     style: { top: "16%", left: "3%"   }, size: "2.6rem", delay: 0.5, anim: "float" },
  { kind: "heart",  style: { top: "30%", left: "0.8%" }, size: "62px", delay: 1.0, anim: "float" },
  { kind: "🌿",     style: { top: "44%", left: "2.5%" }, size: "2.2rem", delay: 1.5, anim: "sway" },
  { kind: "sparkle",style: { top: "55%", left: "0.5%" }, size: "44px", delay: 0.3, anim: "spin" },
  { kind: "tulip",  style: { top: "66%", left: "2%"   }, size: "72px", delay: 0.8, anim: "sway" },
  { kind: "🦋",     style: { top: "78%", left: "1%"   }, size: "2.4rem", delay: 1.3, anim: "drift" },
  { kind: "cherry", style: { top: "90%", left: "3%"   }, size: "60px", delay: 1.8, anim: "float" },
];

const RIGHT_SIDE: Decoration[] = [
  { kind: "🌸",     style: { top: "8%",  right: "1.5%" }, size: "2.8rem", delay: 0.2, anim: "float" },
  { kind: "tulip",  style: { top: "20%", right: "1%"   }, size: "70px", delay: 0.7, anim: "sway" },
  { kind: "💐",     style: { top: "33%", right: "2.5%" }, size: "2.4rem", delay: 1.2, anim: "float" },
  { kind: "cherry", style: { top: "46%", right: "0.5%" }, size: "64px", delay: 1.7, anim: "float" },
  { kind: "🌻",     style: { top: "58%", right: "2%"   }, size: "2.6rem", delay: 0.4, anim: "sway" },
  { kind: "sparkle",style: { top: "70%", right: "1%"   }, size: "42px", delay: 0.9, anim: "spin" },
  { kind: "heart",  style: { top: "82%", right: "2.5%" }, size: "58px", delay: 1.4, anim: "float" },
  { kind: "🌼",     style: { top: "93%", right: "1%"   }, size: "2.2rem", delay: 1.9, anim: "sway" },
];

const EDGES: Decoration[] = [
  { kind: "✨",     style: { top: "3%",  left: "28%" }, size: "1.4rem", delay: 0.6, anim: "spin" },
  { kind: "💕",     style: { top: "2%",  left: "62%" }, size: "1.5rem", delay: 1.1, anim: "float" },
  { kind: "⭐",     style: { top: "4%",  left: "78%" }, size: "1.3rem", delay: 1.6, anim: "spin" },
  { kind: "🌸",     style: { bottom: "2%", left: "22%" }, size: "1.6rem", delay: 0.4, anim: "float" },
  { kind: "🦋",     style: { bottom: "3%", left: "50%" }, size: "1.7rem", delay: 0.9, anim: "drift" },
  { kind: "✨",     style: { bottom: "2%", left: "72%" }, size: "1.3rem", delay: 1.4, anim: "spin" },
];

const ALL_DECORATIONS = [...LEFT_SIDE, ...RIGHT_SIDE, ...EDGES];

/* ─── Component ────────────────────────────────────────────────────────── */

export function FloralBackdrop() {
  // Track click animation per index
  const [popping, setPopping] = useState<number | null>(null);

  return (
    <div
      aria-hidden
      className="floral-backdrop pointer-events-none fixed inset-0 overflow-hidden select-none"
      style={{ zIndex: 5 }}
    >
      {/* Color blobs in the corners (no interaction) */}
      <span
        className="floral-blob"
        style={{
          top: "-180px",
          left: "-180px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent), transparent 70%)",
        }}
      />
      <span
        className="floral-blob"
        style={{
          bottom: "-200px",
          right: "-200px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%)",
        }}
      />
      <span
        className="floral-blob"
        style={{
          top: "40%",
          right: "-260px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--peach) 60%, transparent), transparent 70%)",
          width: "440px",
          height: "440px",
        }}
      />
      <span
        className="floral-blob"
        style={{
          top: "55%",
          left: "-220px",
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)",
          width: "380px",
          height: "380px",
        }}
      />

      {/* Decorations */}
      {ALL_DECORATIONS.map((deco, idx) => (
        <button
          key={idx}
          type="button"
          tabIndex={-1}
          onMouseEnter={() => setPopping(idx)}
          onMouseLeave={() => setPopping((p) => (p === idx ? null : p))}
          onClick={(e) => {
            e.preventDefault();
            setPopping(idx);
            setTimeout(
              () => setPopping((p) => (p === idx ? null : p)),
              700,
            );
          }}
          className={cn(
            "floral-bloom group",
            `anim-${deco.anim ?? "float"}`,
            popping === idx && "is-popping",
          )}
          style={{
            ...deco.style,
            fontSize: deco.size,
            width: isSvgKind(deco.kind) ? deco.size : undefined,
            height: isSvgKind(deco.kind) ? deco.size : undefined,
            animationDelay: `${deco.delay}s`,
          }}
        >
          <span className="floral-bloom-inner">
            {renderKind(deco.kind)}
          </span>
          <span className="floral-sparkles" aria-hidden>
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
            <span>✨</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function isSvgKind(k: string) {
  return ["daisy", "tulip", "heart", "sparkle", "cherry"].includes(k);
}

function renderKind(k: string) {
  if (k === "daisy") return <Daisy className="w-full h-full" />;
  if (k === "tulip") return <Tulip className="w-full h-full" />;
  if (k === "heart") return <HeartGlow className="w-full h-full" />;
  if (k === "sparkle") return <Sparkle className="w-full h-full" />;
  if (k === "cherry") return <Cherry className="w-full h-full" />;
  return <span>{k}</span>;
}
