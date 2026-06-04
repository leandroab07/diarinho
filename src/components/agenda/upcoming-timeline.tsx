"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/agenda/event-form";
import { deleteEvent } from "@/app/(app)/agenda/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Clock, MapPin, BellRing } from "lucide-react";
import {
  format,
  isToday,
  isTomorrow,
  isThisWeek,
  isSameDay,
  startOfDay,
  differenceInCalendarDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  type EventRow,
  type ReminderRow,
  maxActiveStatus,
} from "@/lib/reminders";
import { cn } from "@/lib/utils";

type EnrichedEvent = EventRow & { event_reminders: ReminderRow[] };

function dayLabel(date: Date, now: Date) {
  if (isSameDay(date, now)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  const diff = differenceInCalendarDays(date, startOfDay(now));
  if (diff > 1 && diff <= 6) return format(date, "EEEE", { locale: ptBR });
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

export function UpcomingTimeline({
  events,
  nowIso,
}: {
  events: EnrichedEvent[];
  nowIso: string;
}) {
  const router = useRouter();
  const now = useMemo(() => new Date(nowIso), [nowIso]);

  // Group by calendar day
  const groups = useMemo(() => {
    const m = new Map<string, { date: Date; items: EnrichedEvent[] }>();
    for (const ev of events) {
      const d = startOfDay(new Date(ev.starts_at));
      const k = d.toISOString();
      if (!m.has(k)) m.set(k, { date: d, items: [] });
      m.get(k)!.items.push(ev);
    }
    return Array.from(m.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [events]);

  async function handleDelete(id: string) {
    if (!confirm("Apagar esse compromisso?")) return;
    const r = await deleteEvent(id);
    if (!r.ok) {
      toast.error("Não consegui apagar 🥺", { description: r.error });
      return;
    }
    toast.success("Compromisso apagado");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {groups.map(({ date, items }) => (
        <section key={date.toISOString()} className="relative">
          <div className="sticky top-16 z-10 mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card)] border-2 border-[var(--border)] shadow-[var(--shadow-soft)] backdrop-blur">
            <span className="text-2xl" aria-hidden>
              {isSameDay(date, now)
                ? "🌟"
                : isTomorrow(date)
                  ? "🌸"
                  : isThisWeek(date, { weekStartsOn: 0 })
                    ? "🌷"
                    : "🌿"}
            </span>
            <div className="text-left">
              <p className="font-bold capitalize leading-none">
                {dayLabel(date, now)}
              </p>
              <p className="text-[10px] text-[var(--muted-fg)] uppercase tracking-wide">
                {format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <ol className="relative pl-2 md:pl-6 border-l-2 border-dashed border-[var(--border)] ml-3 space-y-3">
            {items.map((ev) => {
              const status = maxActiveStatus(
                ev.event_reminders ?? [],
                ev,
                now,
              );
              return (
                <li key={ev.id} className="relative group">
                  <span
                    className={cn(
                      "absolute -left-[1.05rem] md:-left-[1.7rem] top-4 h-4 w-4 rounded-full border-2 border-[var(--card)] shadow-sm",
                      status && "animate-pulse",
                    )}
                    style={{ background: ev.color }}
                  />
                  <Card
                    className="p-4 transition-all hover:translate-x-1 hover:shadow-lg"
                    style={{ borderLeft: `5px solid ${ev.color}` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-center shrink-0 w-14">
                        <p className="text-xs font-bold text-[var(--muted-fg)] uppercase">
                          {ev.all_day
                            ? "🌞"
                            : format(new Date(ev.starts_at), "HH:mm")}
                        </p>
                        {!ev.all_day && (
                          <p className="text-[10px] text-[var(--muted-fg)]">
                            {format(new Date(ev.starts_at), "EEE", {
                              locale: ptBR,
                            })}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base">{ev.title}</h3>
                          {status && (
                            <Badge variant="default">⏰ {status.label}</Badge>
                          )}
                          {ev.all_day && (
                            <Badge variant="soft">dia inteiro</Badge>
                          )}
                        </div>
                        {(ev.location || ev.description) && (
                          <div className="mt-1.5 space-y-1">
                            {ev.location && (
                              <p className="text-xs text-[var(--muted-fg)] flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {ev.location}
                              </p>
                            )}
                            {ev.description && (
                              <p className="text-sm text-[var(--muted-fg)] whitespace-pre-wrap line-clamp-2">
                                {ev.description}
                              </p>
                            )}
                          </div>
                        )}
                        {ev.event_reminders.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {ev.event_reminders.map((r) => (
                              <span
                                key={r.id}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--muted-fg)] bg-[var(--muted)] rounded-full px-2 py-0.5"
                              >
                                <BellRing className="h-2.5 w-2.5" />
                                {r.value}{" "}
                                {r.unit === "minutes"
                                  ? "min"
                                  : r.unit === "hours"
                                    ? "h"
                                    : "d"}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <EventForm
                          event={ev}
                          reminders={ev.event_reminders ?? []}
                          triggerLabel=" "
                          triggerVariant="ghost"
                          triggerSize="sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ev.id)}
                          aria-label="Apagar"
                        >
                          <Trash2 className="h-4 w-4 text-[var(--danger)]" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
