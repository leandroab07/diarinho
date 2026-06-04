"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { EventRow, ReminderRow } from "@/lib/reminders";
import { maxActiveStatus } from "@/lib/reminders";

type Enriched = EventRow & { event_reminders: ReminderRow[] };

export function MonthCalendar({
  events,
  nowIso,
  selectedDay,
  onSelect,
}: {
  events: Enriched[];
  nowIso: string;
  selectedDay: Date | null;
  onSelect?: (day: Date) => void;
}) {
  const today = useMemo(() => new Date(nowIso), [nowIso]);
  const [cursor, setCursor] = useState<Date>(today);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const m = new Map<string, Enriched[]>();
    for (const ev of events) {
      const k = format(new Date(ev.starts_at), "yyyy-MM-dd");
      const arr = m.get(k) ?? [];
      arr.push(ev);
      m.set(k, arr);
    }
    return m;
  }, [events]);

  return (
    <Card className="p-4 md:p-6 relative overflow-hidden">
      {/* Decorative corner accents (only on the pink theme they pop) */}
      <span
        aria-hidden
        className="absolute -top-6 -right-6 text-7xl opacity-10 select-none rotate-12 pointer-events-none"
      >
        🌸
      </span>
      <span
        aria-hidden
        className="absolute -bottom-8 -left-6 text-7xl opacity-10 select-none -rotate-12 pointer-events-none"
      >
        🌷
      </span>

      <header className="relative flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold capitalize leading-tight">
            {format(cursor, "MMMM", { locale: ptBR })}
          </h2>
          <p className="text-xs text-[var(--muted-fg)] uppercase tracking-wider">
            {format(cursor, "yyyy")}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCursor((c) => subMonths(c, 1))}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="soft"
            size="sm"
            onClick={() => setCursor(today)}
          >
            Hoje
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCursor((c) => addMonths(c, 1))}
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--muted-fg)] mb-2">
        {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((d) => (
          <div key={d} className="py-1 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const k = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(k) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const isToday_ = isSameDay(day, today);
          const selected = selectedDay && isSameDay(day, selectedDay);
          const hasActiveReminder = dayEvents.some(
            (ev) => !!maxActiveStatus(ev.event_reminders ?? [], ev, today),
          );

          return (
            <button
              key={k}
              type="button"
              onClick={() => onSelect?.(day)}
              className={cn(
                "group relative min-h-[78px] rounded-2xl p-1.5 text-left transition-all border-2",
                inMonth
                  ? "bg-[var(--card)] hover:bg-[var(--muted)] border-transparent"
                  : "bg-transparent text-[var(--muted-fg)]/50 border-transparent",
                isToday_ &&
                  "border-[var(--primary)] bg-[var(--primary)]/8",
                selected &&
                  "ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--card)]",
                hasActiveReminder && "animate-pulse-soft",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-xs font-bold inline-flex items-center justify-center",
                    isToday_ &&
                      "h-6 w-6 rounded-full bg-[var(--primary)] text-[var(--primary-fg)]",
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && (
                  <span className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: ev.color }}
                      />
                    ))}
                  </span>
                )}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className="text-[10px] leading-tight px-1.5 py-0.5 rounded-md truncate font-semibold"
                    style={{
                      background: `${ev.color}26`,
                      color: "var(--card-fg)",
                      borderLeft: `2px solid ${ev.color}`,
                    }}
                    title={`${format(new Date(ev.starts_at), "HH:mm")} · ${ev.title}`}
                  >
                    {ev.all_day
                      ? ev.title
                      : `${format(new Date(ev.starts_at), "HH:mm")} ${ev.title}`}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[9px] text-[var(--muted-fg)] pl-1 font-semibold">
                    +{dayEvents.length - 2} mais
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <footer className="mt-4 pt-3 border-t border-[var(--border)] flex flex-wrap gap-3 text-[10px] text-[var(--muted-fg)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
          hoje
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full animate-pulse bg-[var(--accent)]" />
          lembrete ativo
        </span>
        <span className="ml-auto">clique no dia pra ver detalhes</span>
      </footer>
    </Card>
  );
}
