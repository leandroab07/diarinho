"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Bear, type BearKind } from "@/components/bears";

/**
 * Ursinhos espalhados pelo fundo do site — estilo pelúcia amontoada.
 * - z-index: -1 (atrás do conteúdo)
 * - Conteúdo translúcido deixa ver levemente
 * - Hover: empurra suavemente na direção contrária ao cursor
 * - Click + arraste: pega e solta noutro lugar (salva em localStorage)
 */

/* ─────────────────────────────────────────────────────────────────────
 * Field bear meta
 * ────────────────────────────────────────────────────────────────────── */

type Friend = {
  id: string;
  kind: BearKind;
  /** initial position as % of viewport */
  px: number;
  py: number;
  size: number;
  rotation: number;
};

// Layout estilo "pelúcias amontoadas" — espalhados em toda a tela,
// inclusive cantos, com sobreposição leve.
const DEFAULT_FRIENDS: Friend[] = [
  { id: "b1",  kind: "pink",   px: 6,  py: 14, size: 84, rotation: -8 },
  { id: "b2",  kind: "lilac",  px: 92, py: 10, size: 88, rotation: 10 },
  { id: "b3",  kind: "mint",   px: 18, py: 28, size: 76, rotation: 5 },
  { id: "b4",  kind: "yellow", px: 88, py: 26, size: 80, rotation: -6 },
  { id: "b5",  kind: "blue",   px: 4,  py: 44, size: 82, rotation: 12 },
  { id: "b6",  kind: "peach",  px: 95, py: 42, size: 78, rotation: -10 },
  { id: "b7",  kind: "pink",   px: 22, py: 60, size: 72, rotation: 8 },
  { id: "b8",  kind: "lilac",  px: 86, py: 58, size: 86, rotation: -5 },
  { id: "b9",  kind: "mint",   px: 6,  py: 72, size: 78, rotation: -12 },
  { id: "b10", kind: "yellow", px: 94, py: 74, size: 76, rotation: 8 },
  { id: "b11", kind: "blue",   px: 26, py: 86, size: 80, rotation: 6 },
  { id: "b12", kind: "peach",  px: 76, py: 88, size: 82, rotation: -8 },
  { id: "b13", kind: "pink",   px: 50, py: 6,  size: 62, rotation: -4 },
  { id: "b14", kind: "mint",   px: 48, py: 94, size: 64, rotation: 10 },
  { id: "b15", kind: "lilac",  px: 12, py: 90, size: 60, rotation: -15 },
  { id: "b16", kind: "yellow", px: 90, py: 88, size: 58, rotation: 12 },
  { id: "b17", kind: "peach",  px: 60, py: 38, size: 56, rotation: 7 },
  { id: "b18", kind: "blue",   px: 38, py: 50, size: 58, rotation: -6 },
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

/* ─────────────────────────────────────────────────────────────────────
 * Draggable bear
 * ────────────────────────────────────────────────────────────────────── */

function FieldBear({
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

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
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
        const force = (radius - dist) / radius;
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [dragging, push.x, push.y]);

  useEffect(() => {
    if (!dragging) return;

    function handlePointerMove(e: PointerEvent) {
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
      className={cn("field-friend absolute select-none touch-none", dragging && "is-dragging")}
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
          ? "drop-shadow(0 14px 26px rgba(0,0,0,0.3))"
          : "drop-shadow(0 8px 16px color-mix(in srgb, var(--primary) 35%, transparent))",
      }}
      onPointerDown={handlePointerDown}
    >
      <Bear kind={friend.kind} className="w-full h-full" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * Edge ornaments — corações e sparkles pequenos
 * ────────────────────────────────────────────────────────────────────── */

const EDGES = [
  { kind: "✨", style: { top: "0.5%", left: "30%" }, size: "1.3rem", delay: 0.6, anim: "spin" as const },
  { kind: "💕", style: { top: "0.3%", left: "62%" }, size: "1.4rem", delay: 1.1, anim: "float" as const },
  { kind: "⭐", style: { top: "0.7%", left: "78%" }, size: "1.2rem", delay: 1.6, anim: "spin" as const },
  { kind: "🌸", style: { bottom: "0.5%", left: "22%" }, size: "1.5rem", delay: 0.4, anim: "float" as const },
  { kind: "💖", style: { bottom: "1%", left: "50%" }, size: "1.6rem", delay: 0.9, anim: "float" as const },
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

  const friendPos = (f: Friend) => positions[f.id] ?? { px: f.px, py: f.py };

  return (
    <>
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

      <div
        aria-hidden
        className="field-friends pointer-events-none fixed inset-0 overflow-visible"
        style={{ zIndex: -1 }}
      >
        {mounted && DEFAULT_FRIENDS.map((f) => (
          <FieldBear
            key={f.id}
            friend={f}
            position={friendPos(f)}
            onMove={handleMove(f.id)}
          />
        ))}
      </div>

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
