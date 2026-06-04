"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative friends — drawn as cute SVGs.
 *
 * - "Field" creatures are scattered all over the screen, **behind** the
 *   content (z-index: -1) and you can drag them around (position saved
 *   to localStorage).
 * - "Edge" creatures (small emojis) stay in the corners.
 *
 * Hover: the creature gets pushed in the direction the cursor is coming
 * from, like a shy animal stepping aside. Drag: pick it up and drop it
 * somewhere else.
 */

/* ─────────────────────────────────────────────────────────────────────
 * CARE BEARS
 * ────────────────────────────────────────────────────────────────────── */

type BearProps = {
  fur: string;
  furDark: string;
  belly: string;
  cheek: string;
  symbol: "heart" | "star" | "rainbow" | "sun";
  className?: string;
};

function CareBear({ fur, furDark, belly, cheek, symbol, className = "" }: BearProps) {
  const id = `bear-${symbol}-${fur.replace("#", "")}`;
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id={`bf-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={fur} />
          <stop offset="100%" stopColor={furDark} />
        </radialGradient>
        <radialGradient id={`bb-${id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor={belly} />
        </radialGradient>
        <radialGradient id={`bc-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cheek} />
          <stop offset="100%" stopColor={cheek} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="36" cy="36" r="16" fill={`url(#bf-${id})`} stroke={furDark} strokeWidth="1.2" />
      <circle cx="104" cy="36" r="16" fill={`url(#bf-${id})`} stroke={furDark} strokeWidth="1.2" />
      <circle cx="36" cy="36" r="9" fill={belly} />
      <circle cx="104" cy="36" r="9" fill={belly} />
      <ellipse cx="70" cy="110" rx="34" ry="26" fill={`url(#bf-${id})`} stroke={furDark} strokeWidth="1.2" />
      <circle cx="70" cy="64" r="34" fill={`url(#bf-${id})`} stroke={furDark} strokeWidth="1.2" />
      <ellipse cx="70" cy="112" rx="22" ry="18" fill={`url(#bb-${id})`} />
      <g transform="translate(70 112)">
        {symbol === "heart" && (
          <path d="M0 6 C -10 -2, -12 -10, -6 -12 C -2 -13, 0 -10, 0 -8 C 0 -10, 2 -13, 6 -12 C 12 -10, 10 -2, 0 6 Z" fill="#ff4b7d" stroke="#a82451" strokeWidth="0.8" />
        )}
        {symbol === "star" && (
          <path d="M0 -12 L3 -4 L11 -4 L5 1 L7 9 L0 4 L-7 9 L-5 1 L-11 -4 L-3 -4 Z" fill="#ffd54f" stroke="#a8740c" strokeWidth="0.8" />
        )}
        {symbol === "rainbow" && (
          <g>
            <path d="M-11 4 A 11 11 0 0 1 11 4" fill="none" stroke="#ff6b9d" strokeWidth="3" strokeLinecap="round" />
            <path d="M-8 4 A 8 8 0 0 1 8 4" fill="none" stroke="#ffd166" strokeWidth="3" strokeLinecap="round" />
            <path d="M-5 4 A 5 5 0 0 1 5 4" fill="none" stroke="#5fb88a" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {symbol === "sun" && (
          <g>
            <circle cx="0" cy="-1" r="6" fill="#ffd54f" stroke="#a8740c" strokeWidth="0.8" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="0" y1="-9" x2="0" y2="-12" stroke="#ffb84d" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${a})`} />
            ))}
          </g>
        )}
      </g>
      <ellipse cx="70" cy="78" rx="14" ry="10" fill="#fff5ec" />
      <ellipse cx="70" cy="70" rx="3.5" ry="2.5" fill="#3a2030" />
      <path d="M64 80 Q 70 86 76 80" stroke="#3a2030" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="62" r="3" fill="#3a2030" />
      <circle cx="84" cy="62" r="3" fill="#3a2030" />
      <circle cx="57" cy="61" r="1" fill="#fff" />
      <circle cx="85" cy="61" r="1" fill="#fff" />
      <circle cx="48" cy="76" r="6" fill={`url(#bc-${id})`} />
      <circle cx="92" cy="76" r="6" fill={`url(#bc-${id})`} />
      <ellipse cx="44" cy="124" rx="6" ry="5" fill={belly} stroke={furDark} strokeWidth="0.8" />
      <ellipse cx="96" cy="124" rx="6" ry="5" fill={belly} stroke={furDark} strokeWidth="0.8" />
    </svg>
  );
}

const bears = {
  pink: { fur: "#ffb3cf", furDark: "#d97aa0", belly: "#ffe4ee", cheek: "#ff6699", symbol: "heart" as const },
  lilac: { fur: "#caa9ee", furDark: "#9a78c4", belly: "#ede1ff", cheek: "#b884e6", symbol: "star" as const },
  mint: { fur: "#a8e0c3", furDark: "#6db595", belly: "#e3f5ec", cheek: "#76ccaa", symbol: "rainbow" as const },
  yellow: { fur: "#ffe28a", furDark: "#d6a847", belly: "#fff6cf", cheek: "#ffc857", symbol: "sun" as const },
};

/* ─────────────────────────────────────────────────────────────────────
 * BUNNIES
 * ────────────────────────────────────────────────────────────────────── */

type BunnyProps = {
  fur: string;
  furDark: string;
  inner: string;
  bow?: string;
  variant: "white" | "cream" | "lilac";
  className?: string;
};

function Bunny({ fur, furDark, inner, bow, variant, className = "" }: BunnyProps) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id={`bn-${variant}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor={fur} />
          <stop offset="100%" stopColor={furDark} />
        </radialGradient>
      </defs>
      <ellipse cx="48" cy="32" rx="10" ry="26" fill={`url(#bn-${variant})`} stroke={furDark} strokeWidth="1" transform="rotate(-8 48 32)" />
      <ellipse cx="48" cy="32" rx="5" ry="20" fill={inner} transform="rotate(-8 48 32)" />
      <ellipse cx="92" cy="32" rx="10" ry="26" fill={`url(#bn-${variant})`} stroke={furDark} strokeWidth="1" transform="rotate(8 92 32)" />
      <ellipse cx="92" cy="32" rx="5" ry="20" fill={inner} transform="rotate(8 92 32)" />
      <circle cx="70" cy="80" r="34" fill={`url(#bn-${variant})`} stroke={furDark} strokeWidth="1.2" />
      {bow && (
        <g transform="translate(96 56) rotate(20)">
          <path d="M-12 0 L0 6 L12 0 L8 -6 L-8 -6 Z" fill={bow} stroke="#a44168" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill={bow} stroke="#a44168" strokeWidth="0.8" />
        </g>
      )}
      <circle cx="48" cy="92" r="7" fill={inner} opacity="0.85" />
      <circle cx="92" cy="92" r="7" fill={inner} opacity="0.85" />
      <path d="M52 78 Q 56 82 60 78" stroke="#3a2030" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M80 78 Q 84 82 88 78" stroke="#3a2030" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M70 86 L70 90 M70 90 L66 94 M70 90 L74 94" stroke="#d36994" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="86" rx="3.5" ry="2.5" fill="#ec88a3" />
      <path d="M58 92 L46 90 M58 96 L46 98" stroke="#a06078" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M82 92 L94 90 M82 96 L94 98" stroke="#a06078" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

const bunnies = {
  white: { fur: "#fff", furDark: "#e8c4d2", inner: "#ffb3cf", variant: "white" as const },
  cream: { fur: "#fff1d4", furDark: "#dbb887", inner: "#ffc7a3", bow: "#ff7eb1", variant: "cream" as const },
  lilac: { fur: "#f1e5ff", furDark: "#b89bd6", inner: "#d8b3ff", bow: "#ffb3cf", variant: "lilac" as const },
};

/* ─────────────────────────────────────────────────────────────────────
 * KAWAII FLOWERS
 * ────────────────────────────────────────────────────────────────────── */

function KawaiiDaisy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id="kd-petal" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="55%" stopColor="#ffeaf2" />
          <stop offset="100%" stopColor="#ffc3d6" />
        </radialGradient>
        <radialGradient id="kd-core" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff6c4" />
          <stop offset="55%" stopColor="#ffc83d" />
          <stop offset="100%" stopColor="#e07c00" />
        </radialGradient>
      </defs>
      <g transform="translate(70 70)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse cx="0" cy="-34" rx="12" ry="26" fill="url(#kd-petal)" stroke="#f4a8c0" strokeWidth="1.2" />
          </g>
        ))}
      </g>
      <circle cx="70" cy="70" r="20" fill="url(#kd-core)" stroke="#c89525" strokeWidth="1" />
      <ellipse cx="63" cy="67" rx="2.5" ry="3.2" fill="#3a2030" />
      <ellipse cx="77" cy="67" rx="2.5" ry="3.2" fill="#3a2030" />
      <ellipse cx="63" cy="65.5" rx="0.9" ry="1.2" fill="#fff" />
      <ellipse cx="77" cy="65.5" rx="0.9" ry="1.2" fill="#fff" />
      <path d="M64 76 Q 70 81 76 76" stroke="#3a2030" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="56" cy="73" r="2.8" fill="#ff8fb8" opacity="0.7" />
      <circle cx="84" cy="73" r="2.8" fill="#ff8fb8" opacity="0.7" />
    </svg>
  );
}

function KawaiiTulip({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <linearGradient id="kt-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb3cf" />
          <stop offset="60%" stopColor="#ff6699" />
          <stop offset="100%" stopColor="#c4356b" />
        </linearGradient>
        <linearGradient id="kt-leaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9adaaa" />
          <stop offset="100%" stopColor="#3e8a5e" />
        </linearGradient>
      </defs>
      <rect x="66" y="80" width="8" height="48" fill="url(#kt-leaf)" rx="3" />
      <path d="M70 100 C 44 96, 32 116, 36 130 C 56 124, 68 112, 72 102 Z" fill="url(#kt-leaf)" stroke="#2e6b48" strokeWidth="0.8" />
      <path d="M30 60 C 30 36, 54 22, 70 38 C 86 22, 110 36, 110 60 C 110 80, 90 86, 70 86 C 50 86, 30 80, 30 60 Z" fill="url(#kt-petal)" stroke="#9c2455" strokeWidth="1.2" />
      <ellipse cx="60" cy="56" rx="3" ry="3.5" fill="#3a2030" />
      <ellipse cx="80" cy="56" rx="3" ry="3.5" fill="#3a2030" />
      <ellipse cx="60" cy="54" rx="1" ry="1.3" fill="#fff" />
      <ellipse cx="80" cy="54" rx="1" ry="1.3" fill="#fff" />
      <path d="M64 66 Q 70 72 76 66" stroke="#3a2030" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="64" rx="4" ry="3" fill="#ffd1dd" opacity="0.7" />
      <ellipse cx="90" cy="64" rx="4" ry="3" fill="#ffd1dd" opacity="0.7" />
    </svg>
  );
}

function KawaiiCherry({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden>
      <defs>
        <radialGradient id="kc-petal" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="40%" stopColor="#ffd1de" />
          <stop offset="100%" stopColor="#ec7da3" />
        </radialGradient>
        <radialGradient id="kc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4a3" />
          <stop offset="100%" stopColor="#f7c842" />
        </radialGradient>
      </defs>
      <g transform="translate(70 70)">
        {[0, 72, 144, 216, 288].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M0 -44 C 18 -44, 22 -26, 16 -10 C 8 -2, -8 -2, -16 -10 C -22 -26, -18 -44, 0 -44 Z" fill="url(#kc-petal)" stroke="#d96a93" strokeWidth="1" />
            <path d="M0 -44 L0 -32" stroke="#c4456e" strokeWidth="1.4" opacity="0.55" />
          </g>
        ))}
      </g>
      <circle cx="70" cy="70" r="14" fill="url(#kc-core)" stroke="#c89525" strokeWidth="1" />
      <ellipse cx="65" cy="68" rx="2.2" ry="2.8" fill="#3a2030" />
      <ellipse cx="75" cy="68" rx="2.2" ry="2.8" fill="#3a2030" />
      <ellipse cx="65" cy="66.5" rx="0.8" ry="1" fill="#fff" />
      <ellipse cx="75" cy="66.5" rx="0.8" ry="1" fill="#fff" />
      <path d="M66 75 Q 70 78 74 75" stroke="#3a2030" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Field creature meta
 * ────────────────────────────────────────────────────────────────────── */

type Friend = {
  id: string;
  kind:
    | "bear-pink" | "bear-lilac" | "bear-mint" | "bear-yellow"
    | "bunny-white" | "bunny-cream" | "bunny-lilac"
    | "flower-daisy" | "flower-tulip" | "flower-cherry";
  /** initial position as % of viewport (so it scales w/ screen) */
  px: number;
  py: number;
  size: number;
  rotation: number;
};

const DEFAULT_FRIENDS: Friend[] = [
  { id: "f1",  kind: "bear-pink",   px: 8,  py: 18, size: 76, rotation: -6 },
  { id: "f2",  kind: "bear-lilac",  px: 92, py: 12, size: 80, rotation: 8 },
  { id: "f3",  kind: "bunny-white", px: 18, py: 38, size: 70, rotation: 4 },
  { id: "f4",  kind: "flower-daisy",px: 88, py: 32, size: 64, rotation: 10 },
  { id: "f5",  kind: "bear-mint",   px: 4,  py: 52, size: 78, rotation: 12 },
  { id: "f6",  kind: "bunny-cream", px: 95, py: 50, size: 74, rotation: -8 },
  { id: "f7",  kind: "flower-tulip",px: 25, py: 68, size: 68, rotation: -10 },
  { id: "f8",  kind: "bear-yellow", px: 90, py: 70, size: 76, rotation: 5 },
  { id: "f9",  kind: "bunny-lilac", px: 6,  py: 82, size: 74, rotation: -4 },
  { id: "f10", kind: "flower-cherry",px: 80, py: 88, size: 66, rotation: 14 },
  { id: "f11", kind: "bear-pink",   px: 50, py: 8,  size: 60, rotation: -5 },
  { id: "f12", kind: "flower-daisy",px: 48, py: 92, size: 58, rotation: 8 },
];

const STORAGE_KEY = "diarinho.friends-pos";

function loadPositions(): Record<string, { px: number; py: number }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, { px: number; py: number }>) : {};
  } catch {
    return {};
  }
}

function savePositions(p: Record<string, { px: number; py: number }>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function renderKind(k: Friend["kind"]) {
  if (k === "bear-pink") return <CareBear {...bears.pink} className="w-full h-full" />;
  if (k === "bear-lilac") return <CareBear {...bears.lilac} className="w-full h-full" />;
  if (k === "bear-mint") return <CareBear {...bears.mint} className="w-full h-full" />;
  if (k === "bear-yellow") return <CareBear {...bears.yellow} className="w-full h-full" />;
  if (k === "bunny-white") return <Bunny {...bunnies.white} className="w-full h-full" />;
  if (k === "bunny-cream") return <Bunny {...bunnies.cream} className="w-full h-full" />;
  if (k === "bunny-lilac") return <Bunny {...bunnies.lilac} className="w-full h-full" />;
  if (k === "flower-daisy") return <KawaiiDaisy className="w-full h-full" />;
  if (k === "flower-tulip") return <KawaiiTulip className="w-full h-full" />;
  if (k === "flower-cherry") return <KawaiiCherry className="w-full h-full" />;
  return null;
}

/* ─────────────────────────────────────────────────────────────────────
 * Draggable friend component
 * ────────────────────────────────────────────────────────────────────── */

function FieldFriend({
  friend,
  position,
  onMove,
}: {
  friend: Friend;
  position: { px: number; py: number };
  onMove: (p: { px: number; py: number }) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [push, setPush] = useState({ x: 0, y: 0, scale: 1 });
  const [dragging, setDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

  // Mouse-near → push effect (without entering the element directly)
  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (dragging) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = r.width * 0.9;
      if (dist < radius) {
        const force = (radius - dist) / radius; // 0..1
        const k = 28 * force;
        setPush({
          x: (dx / (dist || 1)) * k,
          y: (dy / (dist || 1)) * k,
          scale: 1 + 0.06 * force,
        });
      } else if (push.x !== 0 || push.y !== 0) {
        setPush({ x: 0, y: 0, scale: 1 });
      }
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [dragging, push.x, push.y]);

  // Drag handlers
  useEffect(() => {
    if (!dragging) return;

    function handlePointerMove(e: PointerEvent) {
      movedRef.current = true;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = e.clientX - dragOffsetRef.current.x;
      const y = e.clientY - dragOffsetRef.current.y;
      const px = Math.max(0, Math.min(100, (x / vw) * 100));
      const py = Math.max(0, Math.min(100, (y / vh) * 100));
      onMove({ px, py });
    }
    function handlePointerUp() {
      setDragging(false);
    }
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [dragging, onMove]);

  function handlePointerDown(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - r.left - r.width / 2,
      y: e.clientY - r.top - r.height / 2,
    };
    movedRef.current = false;
    setDragging(true);
    setPush({ x: 0, y: 0, scale: 1.08 });
    el.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }

  const transform = dragging
    ? `translate(-50%, -50%) rotate(${friend.rotation - 6}deg) scale(${push.scale})`
    : `translate(calc(-50% + ${push.x}px), calc(-50% + ${push.y}px)) rotate(${friend.rotation + push.x * 0.4}deg) scale(${push.scale})`;

  return (
    <div
      ref={ref}
      className={cn(
        "field-friend group absolute select-none touch-none",
        dragging && "is-dragging",
      )}
      style={{
        left: `${position.px}%`,
        top: `${position.py}%`,
        width: `${friend.size}px`,
        height: `${friend.size}px`,
        transform,
        transition: dragging
          ? "transform 60ms linear, filter 0.3s ease"
          : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease",
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 60 : -1,
        pointerEvents: "auto",
        filter: dragging
          ? "drop-shadow(0 12px 24px rgba(0,0,0,0.25))"
          : "drop-shadow(0 6px 14px color-mix(in srgb, var(--primary) 30%, transparent))",
      }}
      onPointerDown={handlePointerDown}
    >
      {renderKind(friend.kind)}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Edge ornaments (top/bottom)
 * ────────────────────────────────────────────────────────────────────── */

const EDGES = [
  { kind: "✨", style: { top: "0.5%", left: "30%" }, size: "1.3rem", delay: 0.6, anim: "spin" as const },
  { kind: "💕", style: { top: "0.3%", left: "62%" }, size: "1.4rem", delay: 1.1, anim: "float" as const },
  { kind: "⭐", style: { top: "0.7%", left: "78%" }, size: "1.2rem", delay: 1.6, anim: "spin" as const },
  { kind: "🌸", style: { bottom: "0.5%", left: "22%" }, size: "1.5rem", delay: 0.4, anim: "float" as const },
  { kind: "🦋", style: { bottom: "1%", left: "50%" }, size: "1.6rem", delay: 0.9, anim: "drift" as const },
  { kind: "✨", style: { bottom: "0.5%", left: "72%" }, size: "1.2rem", delay: 1.4, anim: "spin" as const },
];

/* ─────────────────────────────────────────────────────────────────────
 * Main component
 * ────────────────────────────────────────────────────────────────────── */

export function FloralBackdrop() {
  const [positions, setPositions] = useState<Record<string, { px: number; py: number }>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPositions(loadPositions());
    setMounted(true);
  }, []);

  const handleMove = useCallback(
    (id: string) => (p: { px: number; py: number }) => {
      setPositions((prev) => {
        const next = { ...prev, [id]: p };
        savePositions(next);
        return next;
      });
    },
    [],
  );

  const friendPos = (f: Friend) =>
    positions[f.id] ?? { px: f.px, py: f.py };

  return (
    <>
      {/* Blobs of color — fixed, behind everything */}
      <div
        aria-hidden
        className="floral-blobs pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: -2 }}
      >
        <span className="floral-blob" style={{ top: "-180px", left: "-180px", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent), transparent 70%)" }} />
        <span className="floral-blob" style={{ bottom: "-200px", right: "-200px", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%)" }} />
        <span className="floral-blob" style={{ top: "40%", right: "-260px", background: "radial-gradient(circle, color-mix(in srgb, var(--peach) 60%, transparent), transparent 70%)", width: "440px", height: "440px" }} />
        <span className="floral-blob" style={{ top: "55%", left: "-220px", background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)", width: "380px", height: "380px" }} />
      </div>

      {/* Field creatures — scattered, draggable, behind content */}
      <div
        aria-hidden
        className="field-friends pointer-events-none fixed inset-0 overflow-visible"
        style={{ zIndex: -1 }}
      >
        {mounted && DEFAULT_FRIENDS.map((f) => (
          <FieldFriend
            key={f.id}
            friend={f}
            position={friendPos(f)}
            onMove={handleMove(f.id)}
          />
        ))}
      </div>

      {/* Edge ornaments — always visible, small, in the safe top/bottom strips */}
      <div
        aria-hidden
        className="floral-edges pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {EDGES.map((deco, idx) => (
          <span
            key={idx}
            className={`floral-bloom floral-edge anim-${deco.anim}`}
            style={{
              ...deco.style,
              fontSize: deco.size,
              animationDelay: `${deco.delay}s`,
            }}
          >
            <span className="floral-bloom-inner">{deco.kind}</span>
          </span>
        ))}
      </div>
    </>
  );
}
