"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bear, BEAR_KINDS, BEAR_LABELS, BEAR_WEIGHT, type BearKind } from "@/components/bears";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PHYSICS_CONSTANTS,
  clawWorldX,
  createInitialPile,
  step,
  type Body,
  type Claw,
  type World,
} from "@/lib/claw-physics";

/* ─────────────────────────────────────────────────────────────────────
 * MemoBear — evita re-render do SVG complexo a cada frame
 * ────────────────────────────────────────────────────────────────────── */

const MemoBear = memo(function MemoBear({ kind }: { kind: BearKind }) {
  return <Bear kind={kind} className="w-full h-full pointer-events-none" />;
});

/* ─────────────────────────────────────────────────────────────────────
 * Storage keys
 * ────────────────────────────────────────────────────────────────────── */

const STORAGE_COLLECTION = "diarinho.bear-collection-v2";
const STORAGE_STATS = "diarinho.bear-stats-v2";

/* ─────────────────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────────────────── */

export function ClawMachine() {
  const [mounted, setMounted] = useState(false);
  // World state mantida em refs pra evitar re-renders excessivos
  const worldRef = useRef<World>({
    bodies: createInitialPile(14),
    claw: {
      targetX: 50,
      currentX: 50,
      swingAngle: 0,
      swingVel: 0,
      y: PHYSICS_CONSTANTS.ceiling,
      state: "idle",
      gripping: null,
      gripStrength: PHYSICS_CONSTANTS.baseGripStrength,
    },
  });
  // Tick state apenas pra forçar re-render
  const [, setFrame] = useState(0);

  const [collection, setCollection] = useState<BearKind[]>([]);
  const [stats, setStats] = useState({ attempts: 0, wins: 0 });
  const [gripBoost, setGripBoost] = useState(false); // bouns mode

  // ── Load saved ───
  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_COLLECTION);
      const s = localStorage.getItem(STORAGE_STATS);
      if (c) setCollection(JSON.parse(c));
      if (s) setStats(JSON.parse(s));
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  // ── Persist ──
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_COLLECTION, JSON.stringify(collection));
    } catch { /* ignore */ }
  }, [collection, mounted]);
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_STATS, JSON.stringify(stats));
    } catch { /* ignore */ }
  }, [stats, mounted]);

  // ── World callbacks ──
  useEffect(() => {
    const w = worldRef.current;
    w.onDelivered = (b: Body) => {
      setCollection((c) => [...c, b.kind]);
      setStats((s) => ({ ...s, wins: s.wins + 1 }));
      // remove from pile
      w.bodies = w.bodies.filter((x) => x.id !== b.id);
      toast.success(`Pegou um ${BEAR_LABELS[b.kind]}!`, {
        description: `Peso: ${b.mass}g · Força da garra: ${w.claw.gripStrength}g`,
      });
    };
    w.onMissed = (reason) => {
      if (reason === "slipped") {
        toast(`Escorregou! 😅`, {
          description: "Peso ou balanço foi demais pra garra",
        });
      } else if (reason === "no-target") {
        toast("Errou a mira 🎯");
      }
    };
  }, []);

  // ── Physics loop ──
  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    let last = performance.now();
    function loop(t: number) {
      const dt = (t - last) / 1000;
      last = t;
      step(worldRef.current, dt);
      setFrame((f) => (f + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  // ── Controls ──
  const w = worldRef.current;
  const canControl = w.claw.state === "idle";

  const moveLeft = useCallback(() => {
    if (worldRef.current.claw.state !== "idle") return;
    worldRef.current.claw.targetX = Math.max(8, worldRef.current.claw.targetX - 6);
  }, []);
  const moveRight = useCallback(() => {
    if (worldRef.current.claw.state !== "idle") return;
    worldRef.current.claw.targetX = Math.min(92, worldRef.current.claw.targetX + 6);
  }, []);
  const drop = useCallback(() => {
    if (worldRef.current.claw.state !== "idle") return;
    if (worldRef.current.bodies.length === 0) {
      toast("Máquina vazia 🥺 recarregue!");
      return;
    }
    worldRef.current.claw.state = "descending";
    setStats((s) => ({ ...s, attempts: s.attempts + 1 }));
    // schedule transition descending → ascending after closing pause
    const checkClose = () => {
      const c = worldRef.current.claw;
      if (c.state === "closing") {
        window.setTimeout(() => {
          worldRef.current.claw.state = "ascending";
        }, 450);
      } else if (c.state !== "idle") {
        window.setTimeout(checkClose, 50);
      }
    };
    window.setTimeout(checkClose, 50);
  }, []);

  const refill = useCallback(() => {
    if (worldRef.current.claw.state !== "idle") return;
    worldRef.current.bodies = createInitialPile(14);
    toast.success("Máquina recheada de novo! 🧸");
  }, []);

  const resetCollection = useCallback(() => {
    if (!confirm("Apagar toda sua coleção e estatísticas?")) return;
    setCollection([]);
    setStats({ attempts: 0, wins: 0 });
    toast("Tudo resetado");
  }, []);

  const toggleGripBoost = useCallback(() => {
    setGripBoost((v) => {
      const next = !v;
      worldRef.current.claw.gripStrength = next ? 140 : PHYSICS_CONSTANTS.baseGripStrength;
      toast(next ? "Garra reforçada ativada 💪" : "Garra normal");
      return next;
    });
  }, []);

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); moveLeft(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); moveRight(); }
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); drop(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight, drop]);

  // Coleção agrupada
  const collectionCount = useMemo(() => {
    const c: Record<BearKind, number> = {
      honey: 0, cream: 0, rose: 0, lavender: 0, sage: 0, skyblue: 0,
    };
    for (const k of collection) c[k]++;
    return c;
  }, [collection]);
  const winRate = stats.attempts > 0
    ? Math.round((stats.wins / stats.attempts) * 100)
    : 0;

  return (
    <div className="grid lg:grid-cols-[1fr,300px] gap-6 items-start">
      {/* === MACHINE === */}
      <Card className="p-3 md:p-5 relative overflow-hidden">
        <header className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <h2 className="font-handwriting text-3xl text-[var(--primary)] leading-none">
              Pegapelúcia
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={refill} disabled={!canControl} title="Recarregar">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </header>

        {/* MACHINE BODY */}
        <div
          className="relative aspect-[5/6] rounded-3xl overflow-hidden select-none"
          style={{
            background:
              "linear-gradient(180deg, #d93953 0%, #b51a3c 18%, #8a0a2c 100%)",
            boxShadow:
              "inset 0 4px 0 rgba(255,255,255,0.18), inset 0 -8px 14px rgba(0,0,0,0.4)",
          }}
        >
          {/* HEADER PANEL (LED display) */}
          <div className="absolute inset-x-0 top-0 h-[8%] flex items-center justify-center">
            <div
              className="px-4 py-1 rounded-md font-mono text-xs tracking-widest"
              style={{
                background: "#1a0810",
                color: "#ffd54f",
                textShadow: "0 0 8px #ffd54f, 0 0 14px rgba(255, 213, 79, 0.5)",
                border: "2px solid #5a1020",
                boxShadow: "inset 0 0 12px rgba(255, 213, 79, 0.2)",
              }}
            >
              ★ PEGAPELÚCIA ★ {String(collection.length).padStart(3, "0")}
            </div>
          </div>

          {/* GLASS BOX */}
          <div
            className="absolute inset-x-[5%] top-[10%] bottom-[20%] rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,235,245,0.45) 0%, rgba(255,200,220,0.35) 50%, rgba(255,180,200,0.4) 100%)",
              border: "3px solid #5a0a2c",
              boxShadow:
                "inset 0 0 24px rgba(0,0,0,0.15), inset 0 6px 12px rgba(255,255,255,0.4)",
            }}
          >
            {/* glass reflection */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.4) 0%, transparent 20%, transparent 80%, rgba(255,255,255,0.15) 100%)",
              }}
            />

            {/* CLAW + BEARS render area — uses % coords */}
            <PlayField worldRef={worldRef} />
          </div>

          {/* CONTROL PANEL */}
          <div
            className="absolute inset-x-0 bottom-0 h-[20%] flex items-center justify-around px-4"
            style={{
              background: "linear-gradient(180deg, #b51a3c 0%, #6a0820 100%)",
              borderTop: "3px solid #ffd54f",
              boxShadow: "inset 0 4px 8px rgba(255,255,255,0.15)",
            }}
          >
            {/* Coin slot (decorative) */}
            <div
              aria-hidden
              className="hidden sm:flex flex-col items-center gap-1"
            >
              <div className="h-2 w-10 rounded-sm bg-black/60" />
              <div className="text-[8px] text-white/60 font-mono">COIN</div>
            </div>

            {/* Joystick (visual) */}
            <div className="relative h-14 w-14 hidden sm:block">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #4a4a55 0%, #2a2a35 60%, #1a1a20 100%)",
                  boxShadow: "inset 0 -3px 6px rgba(0,0,0,0.6)",
                }}
              />
              <div
                className="absolute left-1/2 top-1/2 h-8 w-3 rounded-full"
                style={{
                  background: "linear-gradient(180deg, #ffd6e3 0%, #c7c7d2 100%)",
                  transform: `translate(-50%, -100%) rotate(${(w.claw.targetX - 50) * 0.4}deg)`,
                  transformOrigin: "bottom",
                  transition: "transform 0.2s",
                }}
              />
              <div
                className="absolute left-1/2 top-0 h-5 w-5 rounded-full"
                style={{
                  background: "radial-gradient(circle, #ff6b8a 0%, #b81a3c 100%)",
                  transform: `translate(-50%, -50%)`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>

            {/* Big DROP button */}
            <button
              type="button"
              onClick={drop}
              disabled={!canControl}
              className="relative h-14 w-14 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              style={{
                background: !canControl
                  ? "radial-gradient(circle at 30% 30%, #4a4a55 0%, #2a2a35 100%)"
                  : "radial-gradient(circle at 30% 30%, #ffd54f 0%, #e0a040 60%, #a06820 100%)",
                boxShadow: !canControl
                  ? "inset 0 -3px 6px rgba(0,0,0,0.5)"
                  : "0 4px 0 #6a4815, 0 6px 12px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)",
              }}
              aria-label="Soltar a garra"
              title="Soltar a garra (espaço/enter)"
            >
              <span className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-[#3a2010] uppercase tracking-wider">
                DROP
              </span>
            </button>

            {/* Strength indicator */}
            <div className="hidden sm:flex flex-col items-center gap-1 text-white/80">
              <span className="text-[8px] uppercase tracking-wider">grip</span>
              <span className="text-xs font-mono font-bold">
                {w.claw.gripStrength}g
              </span>
            </div>
          </div>

          {/* CORNER BOLTS */}
          {[
            { top: "4%", left: "3%" },
            { top: "4%", right: "3%" },
            { bottom: "4%", left: "3%" },
            { bottom: "4%", right: "3%" },
          ].map((pos, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{
                ...pos,
                background:
                  "radial-gradient(circle at 30% 30%, #ffd6e3 0%, #888 70%, #444 100%)",
              }}
            />
          ))}
        </div>

        {/* External controls (touch friendly + secondary) */}
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <Button size="lg" variant="soft" onClick={moveLeft} disabled={!canControl}>
            <ChevronLeft className="h-5 w-5" /> Esquerda
          </Button>
          <Button size="lg" onClick={drop} disabled={!canControl} className="min-w-[140px]">
            {canControl ? "Soltar 🎯" : "Indo..."}
          </Button>
          <Button size="lg" variant="soft" onClick={moveRight} disabled={!canControl}>
            Direita <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-center text-xs text-[var(--muted-fg)] mt-2">
          ⌨️ setas movem, espaço/enter solta
        </p>
      </Card>

      {/* === SIDEBAR === */}
      <div className="space-y-4">
        <Card className="p-4">
          <header className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[var(--primary)]" />
              Coleção
            </h3>
            <span className="text-2xl font-handwriting text-[var(--primary)]">
              {collection.length}
            </span>
          </header>
          <div className="space-y-1.5">
            {BEAR_KINDS.map((k) => (
              <div
                key={k}
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-2xl transition-all",
                  collectionCount[k] > 0 ? "bg-[var(--muted)]" : "opacity-40",
                )}
              >
                <div className="w-10 h-11 shrink-0">
                  <Bear kind={k} className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight">{BEAR_LABELS[k]}</p>
                  <p className="text-[10px] text-[var(--muted-fg)]">
                    {BEAR_WEIGHT[k]}g
                  </p>
                </div>
                <span className="text-sm font-bold text-[var(--primary)]">
                  ×{collectionCount[k]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-base mb-3">🎯 Estatísticas</h3>
          <div className="space-y-1 text-sm">
            <p>Tentativas: <strong>{stats.attempts}</strong></p>
            <p>Pegou: <strong>{stats.wins}</strong></p>
            <p>Taxa: <strong>{winRate}%</strong></p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-base mb-3 flex items-center gap-2">
            💪 Garra
          </h3>
          <p className="text-xs text-[var(--muted-fg)] mb-2 leading-snug">
            Cada urso tem peso diferente. Quanto mais pesado, mais chance de
            escapar. Sálvia é a mais pesada (110g), Céu a mais leve (60g).
          </p>
          <Button
            variant={gripBoost ? "accent" : "soft"}
            size="sm"
            onClick={toggleGripBoost}
            className="w-full"
          >
            {gripBoost ? "Reforçada 💪 ON" : "Reforçar garra"}
          </Button>
          <p className="text-[10px] text-[var(--muted-fg)] mt-2 leading-snug">
            {gripBoost
              ? "Aguenta até 140g — pega qualquer urso fácil"
              : "Padrão: 95g — peso ≥ esse vai escorregar"}
          </p>
        </Card>

        {collection.length > 0 && (
          <Button variant="ghost" size="sm" onClick={resetCollection} className="w-full">
            <Trash2 className="h-3 w-3" /> Resetar tudo
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
 * PlayField — renderiza apenas o mundo de bodies + garra. Reads worldRef
 * a cada render do parent (que tikka via setFrame).
 * ────────────────────────────────────────────────────────────────────── */

function PlayField({ worldRef }: { worldRef: React.RefObject<World> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const w = worldRef.current;
  if (!w) return null;
  const { bodies, claw } = w;
  const tipX = clawWorldX(claw);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* PRIZE CHUTE — slot na esquerda inferior */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: "0%",
          top: "75%",
          width: "16%",
          height: "25%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(90, 10, 44, 0.25) 60%, rgba(90, 10, 44, 0.45) 100%)",
          borderRight: "2px dashed rgba(90, 10, 44, 0.4)",
        }}
      >
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#5a0a2c] tracking-widest">
          PRÊMIO
        </div>
      </div>

      {/* RAIL on top */}
      <div
        aria-hidden
        className="absolute left-0 right-0 h-[2px]"
        style={{
          top: `${PHYSICS_CONSTANTS.ceiling}%`,
          background: "#5a0a2c",
          boxShadow: "0 1px 0 rgba(255,255,255,0.4)",
        }}
      />

      {/* CABLE */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: `${claw.currentX}%`,
          top: `${PHYSICS_CONSTANTS.ceiling}%`,
          width: "2px",
          height: `${claw.y - PHYSICS_CONSTANTS.ceiling}%`,
          background: "#3a0a20",
          transform: `translateX(-1px) rotate(${claw.swingAngle}rad)`,
          transformOrigin: "top center",
        }}
      />

      {/* BODIES */}
      {bodies.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.r * 2.6}%`,
            transform: `translate(-50%, -50%) rotate(${b.angle}rad)`,
            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))",
          }}
        >
          <MemoBear kind={b.kind} />
        </div>
      ))}

      {/* CLAW HEAD */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: `${tipX}%`,
          top: `${claw.y}%`,
          transform: `translate(-50%, -50%) rotate(${claw.swingAngle}rad)`,
          width: "11%",
          height: "11%",
        }}
      >
        <ClawHead phase={claw.state} />
      </div>

      {/* FLOOR */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0"
        style={{
          height: `${100 - PHYSICS_CONSTANTS.floor}%`,
          background:
            "linear-gradient(180deg, rgba(90,10,44,0.5) 0%, #5a0a2c 100%)",
          borderTop: "2px solid #ffd54f",
        }}
      />
    </div>
  );
}

function ClawHead({ phase }: { phase: Claw["state"] }) {
  const closed = phase === "closing" || phase === "ascending" || phase === "delivering";
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <defs>
        <linearGradient id="claw-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd6e3" />
          <stop offset="60%" stopColor="#c9c9d4" />
          <stop offset="100%" stopColor="#6a6a7a" />
        </linearGradient>
        <radialGradient id="claw-bolt" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#888" />
        </radialGradient>
      </defs>
      {/* base / motor */}
      <rect x="22" y="2" width="36" height="22" rx="4" fill="url(#claw-base)" stroke="#3a3a45" strokeWidth="1.5" />
      <circle cx="28" cy="13" r="2.5" fill="url(#claw-bolt)" />
      <circle cx="52" cy="13" r="2.5" fill="url(#claw-bolt)" />
      {/* connector */}
      <rect x="36" y="22" width="8" height="6" fill="#3a3a45" />
      {/* claws */}
      <g stroke="#2a2a35" strokeWidth="2" strokeLinejoin="round">
        {closed ? (
          <>
            <path d="M40 28 L30 60 L42 60 Z" fill="url(#claw-base)" />
            <path d="M40 28 L50 60 L38 60 Z" fill="url(#claw-base)" />
          </>
        ) : (
          <>
            <path d="M40 28 L18 62 L32 58 Z" fill="url(#claw-base)" />
            <path d="M40 28 L62 62 L48 58 Z" fill="url(#claw-base)" />
          </>
        )}
      </g>
    </svg>
  );
}
