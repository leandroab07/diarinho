import { createClient } from "@/lib/supabase/server";
import { AgendaView } from "@/components/agenda/agenda-view";
import { EventForm } from "@/components/agenda/event-form";
import { CalendarHeart } from "lucide-react";
import type { EventRow, ReminderRow } from "@/lib/reminders";

export default async function AgendaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*, event_reminders(*)")
    .order("starts_at", { ascending: true });

  const events =
    (data as (EventRow & { event_reminders: ReminderRow[] })[]) ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <CalendarHeart className="h-8 w-8 text-[var(--primary)]" />
            Agenda
          </h1>
          <p className="text-[var(--muted-fg)] mt-1">
            Seus compromissos e lembretes em um só lugar 💝
          </p>
        </div>
        <EventForm />
      </header>

      <AgendaView events={events} />
    </div>
  );
}
