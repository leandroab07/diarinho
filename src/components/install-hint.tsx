"use client";

import { useEffect, useState } from "react";
import { Sparkles, Share, Plus, X } from "lucide-react";

const STORAGE_KEY = "diarinho.install-hint-dismissed";

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  // iPad em iOS 13+ se identifica como Mac com touch
  const iPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOS;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // Safari iOS legacy
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function InstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!detectIOS()) return;
    if (isStandalone()) return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Espera 8s antes de aparecer pra não interromper o boot
    const id = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(id);
  }, []);

  function handleDismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="install-hint-title"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[min(92vw,400px)] rounded-3xl border-2 border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-soft)] animate-pulse-soft"
      style={{
        animationIterationCount: 3,
      }}
    >
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-2 right-2 h-7 w-7 rounded-full hover:bg-[var(--muted)] flex items-center justify-center"
        aria-label="Dispensar"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 rounded-2xl bg-[var(--primary)]/15 items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-[var(--primary)] animate-float" />
        </span>
        <div className="flex-1 min-w-0 pr-6">
          <p id="install-hint-title" className="font-bold text-sm leading-tight">
            Instala o Diarinho no seu iPhone 🌸
          </p>
          <p className="text-xs text-[var(--muted-fg)] mt-1 leading-snug">
            Vira app de verdade na sua tela inicial — abre em tela cheia.
          </p>
          <ol className="mt-3 space-y-1.5 text-xs">
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 rounded-full bg-[var(--muted)] items-center justify-center font-bold">
                1
              </span>
              <span>
                Toca no botão{" "}
                <Share className="inline h-3.5 w-3.5 text-[var(--primary)] mx-0.5" />{" "}
                no Safari
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 rounded-full bg-[var(--muted)] items-center justify-center font-bold">
                2
              </span>
              <span>
                Escolhe{" "}
                <strong>“Adicionar à Tela de Início”</strong>{" "}
                <Plus className="inline h-3.5 w-3.5 text-[var(--primary)]" />
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
