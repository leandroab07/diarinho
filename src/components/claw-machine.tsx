"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bear, BEAR_KINDS, BEAR_LABELS, type BearKind } from "@/components/bears";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Plushie = {
  id: string;
  kind: BearKind;
  x: number; // % from left of machine
  y: number; // % from top of pile area
  size: number;
  rotation: number;
};

type Phase = "idle" | "descending" | "grabbing" | "ascending" | "delivering";

const STORAGE_COLLECTION = "diarinho.bear-collection";
const STORAGE_STATS = "diarinho.bear-stats";
const STORAGE_PLUSHIES = "diarinho.bear-plushies";

function randomPlushies(count: number): Plushie[] {
  const out: Plushie[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: `p${i}-${Math.random().toString(36).slice(2, 7)}`,
      kind: BEAR_KINDS[Math.floor(Math.random() * BEAR_KINDS.length)],
      x: 8 + Math.random() * 84,
      y: 38 + Math.random() * 58,
      size: 50 + Math.random() * 18,
      rotation: -20 + Math.random() * 40,
    });
  }
  return out;
}

export function ClawMachine() {
  // Posição da garra como % horizontal da máquina (0-100)
  const [clawX, setClawX] = useState(50);
  // Y como % vertical (0 = topo, 100 = fundo)
  const [clawY, setClawY] = useState(8);
  const [phase, setPhase] = useState<Phase>("idle");
  const [holding, setHolding] = useState<BearKind | null>(null);
  const [plushies, setPlushies] = useState<Plushie[]>([]);
  const [collection, setCollection] = useState<BearKind[]>([]);
  const [stats, setStats] = useState({ attempts: 0, wins: 0 });
  const [mounted, setMounted] = useState(false);
  const clawTimerRef = useRef<number | null>(null);

  // Load saved state
  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_COLLECTION);
      const s = localStorage.getItem(STORAGE_STATS);
      const p = localStorage.getItem(STORAGE_PLUSHIES);
      if (c) setCollection(JSON.parse(c));
      if (s) setStats(JSON.parse(s));
      if (p) {
        const parsed = JSON.parse(p) as Plushie[];
        setPlushies(parsed.length > 0 ? parsed : randomPlushies(14));
      } else {
        setPlushies(randomPlushies(14));
      }
    } catch {
      setPlushies(randomPlushies(14));
    }
    setMounted(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_COLLECTION, JSON.stringify(collection));
  }, [collection, mounted]);
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_STATS, JSON.stringify(stats));
  }, [stats, mounted]);
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_PLUSHIES, JSON.stringify(plushies));
  }, [plushies, mounted]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (clawTimerRef.current) window.clearTimeout(clawTimerRef.current);
    };
  }, []);

  const moveLeft = useCallback(() => {
    if (phase !== "idle") return;
    setClawX((x) => Math.max(6, x - 6));
  }, [phase]);
  const moveRight = useCallback(() => {
    if (phase !== "idle") return;
    setClawX((x) => Math.min(94, x + 6));
  }, [phase]);

  const drop = useCallback(() => {
    if (phase !== "idle") return;
    if (plushies.length === 0) {
      toast("Máquina vazia — recarregue 🥺");
      return;
    }
    setPhase("descending");
    setStats((s) => ({ ...s, attempts: s.attempts + 1 }));

    // animar descida
    setClawY(78);

    clawTimerRef.current = window.setTimeout(() => {
      // checa colisão: ursinho mais próximo horizontalmente E na faixa do fundo
      const candidates = plushies
        .map((p) => ({
          plushie: p,
          dist: Math.abs(p.x - clawX),
        }))
        .filter((c) => c.dist < 10)
        .sort((a, b) => a.dist - b.dist);

      const target = candidates[0]?.plushie;
      // chance baseada em proximidade: mais perto = mais provável
      const baseChance = target ? Math.max(0.35, 0.85 - candidates[0].dist * 0.04) : 0;
      const success = target && Math.random() < baseChance;

      setPhase("grabbing");
      clawTimerRef.current = window.setTimeout(() => {
        if (success && target) {
          setHolding(target.kind);
          setPlushies((ps) => ps.filter((p) => p.id !== target.id));
        }
        setPhase("ascending");
        setClawY(8);

        clawTimerRef.current = window.setTimeout(() => {
          if (success && target) {
            setPhase("delivering");
            // mover pro slot do prêmio (esquerda)
            setClawX(8);
            clawTimerRef.current = window.setTimeout(() => {
              setCollection((c) => [...c, target.kind]);
              setStats((s) => ({ ...s, wins: s.wins + 1 }));
              setHolding(null);
              toast.success(`Pegou um ${BEAR_LABELS[target.kind]}! 🎉`);
              setPhase("idle");
            }, 1100);
          } else {
            setPhase("idle");
            if (target) {
              toast("Quase! O ursinho escorregou 😅");
            } else {
              toast("Errou a mira 🎯 tenta de novo");
            }
          }
        }, 900);
      }, 600);
    }, 1400);
  }, [phase, plushies, clawX]);

  const refill = useCallback(() => {
    setPlushies(randomPlushies(14));
    toast.success("Máquina recheada de novo! 🧸");
  }, []);

  const resetCollection = useCallback(() => {
    if (!confirm("Apagar sua coleção de ursinhos?")) return;
    setCollection([]);
    setStats({ attempts: 0, wins: 0 });
    toast("Coleção resetada");
  }, []);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        drop();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight, drop]);

  // Group collection by kind for the trophy bar
  const collectionCount = useMemo(() => {
    const c: Record<BearKind, number> = {
      pink: 0, lilac: 0, mint: 0, yellow: 0, blue: 0, peach: 0,
    };
    for (const k of collection) c[k]++;
    return c;
  }, [collection]);

  const winRate = stats.attempts > 0
    ? Math.round((stats.wins / stats.attempts) * 100)
    : 0;

  return (
    <div className="grid lg:grid-cols-[1fr,300px] gap-6 items-start">
      {/* === Machine === */}
      <Card className="p-3 md:p-5 relative overflow-hidden">
        <header className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <h2 className="font-handwriting text-3xl text-[var(--primary)] leading-none">
              Máquina de Ursinhos
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refill}
            disabled={phase !== "idle"}
            title="Recarregar ursinhos"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </header>

        {/* The machine itself */}
        <div
          className="relative aspect-[4/5] sm:aspect-[5/5] rounded-3xl overflow-hidden border-4 border-[#a85274] shadow-inner select-none"
          style={{
            background:
              "linear-gradient(180deg, #ffe4ee 0%, #ffd4e0 25%, #ffc1d5 65%, #ffb3cf 100%)",
          }}
        >
          {/* Top bar (rail) */}
          <div
            className="absolute top-0 left-0 right-0 h-[10%] flex items-center justify-center text-white font-bold text-sm md:text-base tracking-widest uppercase"
            style={{
              background:
                "linear-gradient(180deg, #d83c6d 0%, #b81a4c 100%)",
              borderBottom: "3px solid #841232",
            }}
          >
            <span className="drop-shadow">⚙ {phase === "idle" ? "Prontinho" : "Trabalhando..."} ⚙</span>
          </div>

          {/* Glass reflection */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-[10%] bottom-[12%] pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.08) 100%)",
            }}
          />

          {/* Plushies pile */}
          <div className="absolute inset-x-0 top-[12%] bottom-[12%]">
            {mounted && plushies.map((p) => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
                }}
              >
                <Bear kind={p.kind} className="w-full h-full" />
              </div>
            ))}
          </div>

          {/* Claw rail */}
          <div
            className="absolute top-[10%] left-0 right-0 h-0.5 bg-[#841232]/40"
            aria-hidden
          />

          {/* Claw */}
          <div
            className={cn(
              "absolute top-[10%] flex flex-col items-center",
              phase === "ascending" ? "transition-all duration-1100" :
              phase === "descending" ? "transition-all duration-1400" :
              phase === "delivering" ? "transition-all duration-1100" :
              "transition-all duration-300",
            )}
            style={{
              left: `${clawX}%`,
              transform: `translate(-50%, ${clawY * 0.9}%)`,
            }}
          >
            {/* Cable */}
            <div
              className="w-0.5 bg-[#841232]"
              style={{ height: `${clawY * 0.9 + 8}px` }}
            />
            {/* Claw head */}
            <div className="relative">
              <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden>
                <defs>
                  <linearGradient id="claw-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd6e3" />
                    <stop offset="60%" stopColor="#c9c9d4" />
                    <stop offset="100%" stopColor="#7a7a8a" />
                  </linearGradient>
                </defs>
                {/* base */}
                <rect x="22" y="6" width="20" height="14" rx="3" fill="url(#claw-g)" stroke="#4a4a55" strokeWidth="1.5" />
                {/* spring */}
                <line x1="32" y1="20" x2="32" y2="28" stroke="#4a4a55" strokeWidth="2" />
                {/* claws */}
                <g stroke="#4a4a55" strokeWidth="2" fill="url(#claw-g)">
                  {phase === "grabbing" || phase === "ascending" || phase === "delivering" ? (
                    /* closed */
                    <>
                      <path d="M32 28 L24 50 L34 50 Z" />
                      <path d="M32 28 L40 50 L30 50 Z" />
                    </>
                  ) : (
                    /* open */
                    <>
                      <path d="M32 28 L16 52 L26 50 Z" />
                      <path d="M32 28 L48 52 L38 50 Z" />
                    </>
                  )}
                </g>
              </svg>
              {/* Held bear */}
              {holding && (phase === "ascending" || phase === "delivering") && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-[60%]"
                  style={{ width: 56, height: 56 }}
                >
                  <Bear kind={holding} className="w-full h-full" />
                </div>
              )}
            </div>
          </div>

          {/* Prize slot (left side) */}
          <div
            className="absolute left-0 bottom-0 w-[18%] h-[20%] flex items-end justify-center"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(135, 0, 50, 0.25) 60%, rgba(135, 0, 50, 0.5) 100%)",
              borderRight: "3px solid #841232",
            }}
          >
            <span className="text-xs text-white font-bold pb-1 drop-shadow">PRÊMIO</span>
          </div>

          {/* Floor */}
          <div
            className="absolute inset-x-0 bottom-0 h-[12%]"
            style={{
              background:
                "linear-gradient(180deg, #c4356b 0%, #841232 100%)",
              borderTop: "3px solid #841232",
            }}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <Button
            size="lg"
            variant="soft"
            onClick={moveLeft}
            disabled={phase !== "idle"}
            aria-label="Mover esquerda"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={drop}
            disabled={phase !== "idle"}
            className="min-w-[160px]"
          >
            <Sparkles className="h-4 w-4" />
            {phase === "idle" ? "Soltar a garra!" : "Aguenta..."}
          </Button>
          <Button
            size="lg"
            variant="soft"
            onClick={moveRight}
            disabled={phase !== "idle"}
            aria-label="Mover direita"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-center text-xs text-[var(--muted-fg)] mt-2">
          💡 Use as setas ← → e espaço/enter pra mirar e soltar
        </p>
      </Card>

      {/* === Collection sidebar === */}
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
          <div className="space-y-2">
            {BEAR_KINDS.map((k) => (
              <div
                key={k}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-2xl transition-all",
                  collectionCount[k] > 0
                    ? "bg-[var(--muted)]"
                    : "opacity-40",
                )}
              >
                <div className="w-10 h-10 shrink-0">
                  <Bear kind={k} className="w-full h-full" />
                </div>
                <span className="flex-1 text-sm font-semibold">
                  {BEAR_LABELS[k]}
                </span>
                <span className="text-sm font-bold text-[var(--primary)]">
                  ×{collectionCount[k]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-base flex items-center gap-2 mb-2">
            🎯 Estatísticas
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-[var(--muted-fg)]">Tentativas:</span>{" "}
              <strong>{stats.attempts}</strong>
            </p>
            <p>
              <span className="text-[var(--muted-fg)]">Pegou:</span>{" "}
              <strong>{stats.wins}</strong>
            </p>
            <p>
              <span className="text-[var(--muted-fg)]">Taxa de acerto:</span>{" "}
              <strong>{winRate}%</strong>
            </p>
          </div>
          {collection.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCollection}
              className="mt-3 w-full"
            >
              <Trash2 className="h-3 w-3" />
              Resetar tudo
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
