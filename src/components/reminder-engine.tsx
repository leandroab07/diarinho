"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  channelsOf,
  reminderStatus,
  type EventRow,
  type ReminderRow,
} from "@/lib/reminders";
import { playReminderChime, primeAudio } from "@/lib/sound";
import { toast } from "sonner";
import { CalendarHeart } from "lucide-react";

/**
 * Polls the DB once a minute. For each active reminder the user hasn't been
 * notified about today, fires the configured channels and marks last_fired_at.
 * Only fires for reminders the user opted into 'site' or 'sound' channels —
 * email/whatsapp are TODO (would be cron job on the server).
 */
export function ReminderEngine({
  notifySoundDefault = true,
}: {
  notifySoundDefault?: boolean;
}) {
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const onGesture = () => primeAudio();
    window.addEventListener("pointerdown", onGesture, { once: true });
    return () => window.removeEventListener("pointerdown", onGesture);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function tick() {
      const { data: events } = await supabase
        .from("events")
        .select("*, event_reminders(*)")
        .gte("starts_at", new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString())
        .order("starts_at", { ascending: true });

      if (cancelled || !events) return;

      const now = new Date();
      for (const ev of events as (EventRow & {
        event_reminders: ReminderRow[];
      })[]) {
        for (const r of ev.event_reminders ?? []) {
          const key = `${r.id}-${todayKey(now)}`;
          if (firedRef.current.has(key)) continue;
          if (r.dismissed_at) continue;
          const channels = channelsOf(r);
          if (!channels.includes("site") && !channels.includes("sound"))
            continue;

          const status = reminderStatus(r, ev, now);
          if (!status.active) continue;

          if (channels.includes("site")) {
            toast(`⏰ ${ev.title}`, {
              description: `${status.label} — não esquece! 💖`,
              icon: <CalendarHeart className="h-5 w-5 text-[var(--primary)]" />,
              duration: 8000,
            });
          }
          if (channels.includes("sound") && notifySoundDefault) {
            playReminderChime();
          }

          firedRef.current.add(key);
          await supabase
            .from("event_reminders")
            .update({ last_fired_at: now.toISOString() })
            .eq("id", r.id);
        }
      }
    }

    void tick();
    const id = setInterval(tick, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [notifySoundDefault]);

  return null;
}

function todayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
