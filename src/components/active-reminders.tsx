"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  channelsOf,
  reminderStatus,
  type EventRow,
  type ReminderRow,
} from "@/lib/reminders";
import { playReminderChime, primeAudio } from "@/lib/sound";
import { Check, BellRing, Volume2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { dismissReminder } from "@/app/(app)/agenda/actions";
import { cn } from "@/lib/utils";

type Item = {
  reminder: ReminderRow;
  event: EventRow;
  label: string;
};

/**
 * Persistent reminder cards: stay on screen until the user clicks ✓.
 * Sound chimes once when a new reminder enters the active window
 * (with a 60s cooldown so multiple simultaneous reminders don't spam).
 * Dismissing sets dismissed_at in DB so it won't reappear after refresh.
 */
export function ActiveReminders({
  notifySoundDefault = true,
}: {
  notifySoundDefault?: boolean;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [dismissing, setDismissing] = useState<Set<string>>(new Set());
  const playedRef = useRef<Set<string>>(new Set());
  const lastPlayRef = useRef<number>(0);

  // Unlock Web Audio after the first user gesture
  useEffect(() => {
    const onGesture = () => primeAudio();
    window.addEventListener("pointerdown", onGesture, { once: true });
    return () => window.removeEventListener("pointerdown", onGesture);
  }, []);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from("events")
      .select("*, event_reminders(*)")
      .gte("starts_at", sinceIso)
      .order("starts_at", { ascending: true });

    if (!data) return;
    const now = new Date();
    const out: Item[] = [];

    for (const ev of data as unknown as (EventRow & {
      event_reminders: ReminderRow[];
    })[]) {
      for (const r of ev.event_reminders ?? []) {
        // Dispensado pelo botão check ⇒ não mostra mais.
        if (r.dismissed_at) continue;
        const channels = channelsOf(r);
        if (!channels.includes("site") && !channels.includes("sound"))
          continue;
        const status = reminderStatus(r, ev, now);
        if (status.active) {
          out.push({ reminder: r, event: ev, label: status.label });
        }
      }
    }

    setItems(out);

    // Play sound once per reminder when it first appears
    const fresh = out.filter((i) => !playedRef.current.has(i.reminder.id));
    if (fresh.length > 0 && notifySoundDefault) {
      const wantsSound = fresh.some((i) =>
        channelsOf(i.reminder).includes("sound"),
      );
      const cooldownOk = Date.now() - lastPlayRef.current > 60_000;
      if (wantsSound && cooldownOk) {
        playReminderChime();
        lastPlayRef.current = Date.now();
      }
      // Light toast just to nudge attention (the card is the persistent UI)
      for (const i of fresh) {
        toast(`⏰ ${i.event.title}`, {
          description: `${i.label} — fica de olho no cartão fofo aí embaixo 💖`,
          duration: 4000,
        });
      }
    }
    for (const i of fresh) playedRef.current.add(i.reminder.id);
  }, [notifySoundDefault]);

  useEffect(() => {
    void refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  async function handleDismiss(id: string) {
    setDismissing((s) => new Set(s).add(id));
    // optimistic: hide immediately
    setItems((items) => items.filter((i) => i.reminder.id !== id));
    const result = await dismissReminder(id);
    if (!result.ok) {
      toast.error("Não consegui dispensar 🥺", { description: result.error });
      // rollback by refetching
      await refresh();
    }
    setDismissing((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-[min(95vw,380px)] pointer-events-none">
      {items.map(({ reminder, event, label }) => (
        <div
          key={reminder.id}
          className={cn(
            "pointer-events-auto rounded-3xl bg-[var(--card)] border-2 p-4 shadow-[var(--shadow-soft)] animate-pulse-soft",
            dismissing.has(reminder.id) && "opacity-50",
          )}
          style={{
            borderColor: event.color,
            boxShadow: `0 8px 28px -8px ${event.color}55, 0 0 0 1px ${event.color}33`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 animate-float"
              style={{ background: `${event.color}22` }}
            >
              <BellRing
                className="h-5 w-5"
                style={{ color: event.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-tight truncate">
                {event.title}
              </p>
              <p className="text-xs text-[var(--muted-fg)] mt-1">
                ⏰ <strong>{label}</strong> ·{" "}
                {format(new Date(event.starts_at), "d 'de' MMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
              {event.location && (
                <p className="text-xs text-[var(--muted-fg)] mt-0.5">
                  📍 {event.location}
                </p>
              )}
              {channelsOf(reminder).includes("sound") && (
                <p className="text-[10px] text-[var(--muted-fg)] mt-1 flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> sininho tocou
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDismiss(reminder.id)}
              disabled={dismissing.has(reminder.id)}
              className="h-10 w-10 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[var(--shadow-soft)] disabled:opacity-50"
              title="Tudo certo, pode dispensar"
              aria-label="Dispensar lembrete"
            >
              <Check className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
