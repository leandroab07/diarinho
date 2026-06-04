import { createClient } from "@/lib/supabase/server";
import { AgendaView } from "@/components/agenda/agenda-view";
import { EventForm } from "@/components/agenda/event-form";
import { CalendarHeart, Sparkles } from "lucide-react";
import type { EventRow, ReminderRow } from "@/lib/reminders";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*, event_reminders(*)")
    .order("starts_at", { ascending: true });

  const events =
    (data as unknown as (EventRow & {
      event_reminders: ReminderRow[];
    })[]) ?? [];

  const nowIso = new Date().toISOString();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <span className="inline-flex h-12 w-12 rounded-2xl bg-[var(--primary)]/15 items-center justify-center animate-float">
              <CalendarHeart className="h-7 w-7 text-[var(--primary)]" />
            </span>
            Agenda
            <Sparkles className="h-5 w-5 text-[var(--accent)] animate-wiggle" />
          </h1>
          <p className="text-[var(--muted-fg)] mt-1">
            {events.length === 0
              ? "Cadê? Tá tudo limpinho ✨"
              : `${events.length} compromisso${events.length !== 1 ? "s" : ""} registrado${events.length !== 1 ? "s" : ""} 💝`}
          </p>
        </div>
        <EventForm />
      </header>

      <AgendaView events={events} nowIso={nowIso} />
    </div>
  );
}
