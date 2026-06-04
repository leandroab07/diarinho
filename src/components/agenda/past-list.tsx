"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/app/(app)/agenda/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EventRow, ReminderRow } from "@/lib/reminders";

type EnrichedEvent = EventRow & { event_reminders: ReminderRow[] };

export function PastList({ events }: { events: EnrichedEvent[] }) {
  const router = useRouter();

  const groups = useMemo(() => {
    const m = new Map<string, { date: Date; items: EnrichedEvent[] }>();
    const sorted = [...events].sort(
      (a, b) =>
        new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime(),
    );
    for (const ev of sorted) {
      const d = startOfMonth(new Date(ev.starts_at));
      const k = d.toISOString();
      if (!m.has(k)) m.set(k, { date: d, items: [] });
      m.get(k)!.items.push(ev);
    }
    return Array.from(m.values());
  }, [events]);

  async function handleDelete(id: string) {
    if (!confirm("Apagar esse compromisso do histórico?")) return;
    const r = await deleteEvent(id);
    if (!r.ok) {
      toast.error("Não consegui apagar 🥺", { description: r.error });
      return;
    }
    toast.success("Apagado");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {groups.map(({ date, items }) => (
        <section key={date.toISOString()}>
          <h3 className="text-sm font-bold text-[var(--muted-fg)] uppercase tracking-wide px-2 mb-2 capitalize">
            {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <div className="space-y-2">
            {items.map((ev) => (
              <Card
                key={ev.id}
                className="p-3 flex items-center gap-3 group"
                style={{ borderLeft: `4px solid ${ev.color}` }}
              >
                <div className="text-center shrink-0 w-12">
                  <p className="text-lg font-bold text-[var(--muted-fg)]">
                    {format(new Date(ev.starts_at), "d")}
                  </p>
                  <p className="text-[10px] text-[var(--muted-fg)] uppercase">
                    {format(new Date(ev.starts_at), "EEE", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{ev.title}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    {format(new Date(ev.starts_at), "d 'de' MMM 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(ev.id)}
                  aria-label="Apagar"
                >
                  <Trash2 className="h-4 w-4 text-[var(--danger)]" />
                </Button>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
