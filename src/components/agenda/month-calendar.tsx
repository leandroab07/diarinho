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
  isToday,
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

export function MonthCalendar({
  events,
  onSelect,
}: {
  events: (EventRow & { event_reminders: ReminderRow[] })[];
  onSelect?: (day: Date) => void;
}) {
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const m = new Map<string, typeof events>();
    for (const ev of events) {
      const k = format(new Date(ev.starts_at), "yyyy-MM-dd");
      const arr = m.get(k) ?? [];
      arr.push(ev);
      m.set(k, arr);
    }
    return m;
  }, [events]);

  return (
    <Card className="p-4 md:p-6">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold capitalize">
          {format(cursor, "MMMM 'de' yyyy", { locale: ptBR })}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCursor((c) => subMonths(c, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="soft"
            size="sm"
            onClick={() => setCursor(new Date())}
          >
            Hoje
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCursor((c) => addMonths(c, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[var(--muted-fg)] mb-2">
        {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((d) => (
          <div key={d} className="py-1 uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const k = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(k) ?? [];
          const inMonth = isSameMonth(day, cursor);
          const today = isToday(day);
          const hasActiveReminder = dayEvents.some((ev) =>
            !!maxActiveStatus(ev.event_reminders ?? [], ev),
          );
          return (
            <button
              key={k}
              type="button"
              onClick={() => onSelect?.(day)}
              className={cn(
                "min-h-[68px] rounded-2xl p-1.5 text-left transition-all border-2",
                inMonth
                  ? "bg-[var(--card)] hover:bg-[var(--muted)] border-transparent"
                  : "bg-transparent text-[var(--muted-fg)]/60 border-transparent",
                today &&
                  "border-[var(--primary)] bg-[var(--primary)]/8",
                hasActiveReminder &&
                  "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--card)]",
              )}
            >
              <div
                className={cn(
                  "text-xs font-semibold mb-1",
                  today && "text-[var(--primary)]",
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    className="text-[10px] leading-tight px-1.5 py-0.5 rounded truncate"
                    style={{
                      background: `${ev.color}30`,
                      color: "var(--card-fg)",
                      borderLeft: `2px solid ${ev.color}`,
                    }}
                    title={ev.title}
                  >
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-[var(--muted-fg)] pl-1">
                    +{dayEvents.length - 3}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function isSameDayCal(a: Date, b: Date) {
  return isSameDay(a, b);
}
