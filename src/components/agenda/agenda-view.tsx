"use client";

import { useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/agenda/event-card";
import { EventForm } from "@/components/agenda/event-form";
import { MonthCalendar } from "@/components/agenda/month-calendar";
import {
  isPast,
  isUpcoming,
  type EventRow,
  type ReminderRow,
} from "@/lib/reminders";
import { CalendarHeart, History, Sparkles, ListTodo } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

type EnrichedEvent = EventRow & { event_reminders: ReminderRow[] };

export function AgendaView({ events }: { events: EnrichedEvent[] }) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const now = useMemo(() => new Date(), []);
  const upcoming = useMemo(
    () => events.filter((ev) => isUpcoming(ev, now)),
    [events, now],
  );
  const past = useMemo(
    () => events.filter((ev) => isPast(ev, now)),
    [events, now],
  );

  const dayEvents = useMemo(() => {
    if (!selectedDay) return [];
    return events.filter((ev) => isSameDay(new Date(ev.starts_at), selectedDay));
  }, [events, selectedDay]);

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
        <TabsTrigger value="upcoming">
          <Sparkles className="h-4 w-4 mr-1" /> Próximos
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <CalendarHeart className="h-4 w-4 mr-1" /> Mês
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-1" /> Histórico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <Empty title="Nada por vir 🌸" description="Agenda livre, aproveita o vento." />
        ) : (
          <div className="grid gap-3">
            {upcoming.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                reminders={ev.event_reminders ?? []}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="calendar" className="space-y-4">
        <MonthCalendar events={events} onSelect={(d) => setSelectedDay(d)} />
        {selectedDay && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>
                  {format(selectedDay, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </span>
                <EventForm
                  initialDate={selectedDay}
                  triggerLabel="Adicionar"
                  triggerVariant="ghost"
                  triggerSize="sm"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayEvents.length === 0 ? (
                <p className="text-sm text-[var(--muted-fg)] py-3 text-center">
                  Nadinha agendado nesse dia 🌷
                </p>
              ) : (
                dayEvents.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    reminders={ev.event_reminders ?? []}
                  />
                ))
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="history">
        {past.length === 0 ? (
          <Empty title="Sem histórico ainda" description="O que passou aparece aqui." />
        ) : (
          <div className="grid gap-3">
            {past.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                reminders={ev.event_reminders ?? []}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function Empty({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader className="text-center py-12">
        <div className="mx-auto h-14 w-14 rounded-full bg-[var(--muted)] flex items-center justify-center mb-2 animate-float">
          <ListTodo className="h-7 w-7 text-[var(--primary)]" />
        </div>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-[var(--muted-fg)] mt-1">{description}</p>
      </CardHeader>
    </Card>
  );
}
