"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "@/components/agenda/event-form";
import { MonthCalendar } from "@/components/agenda/month-calendar";
import { UpcomingTimeline } from "@/components/agenda/upcoming-timeline";
import { PastList } from "@/components/agenda/past-list";
import {
  isPast,
  isUpcoming,
  type EventRow,
  type ReminderRow,
} from "@/lib/reminders";
import { CalendarHeart, History, Sparkles, ListTodo } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EventCard } from "@/components/agenda/event-card";

type EnrichedEvent = EventRow & { event_reminders: ReminderRow[] };

export function AgendaView({
  events,
  nowIso,
}: {
  events: EnrichedEvent[];
  nowIso: string;
}) {
  // Initialise `now` from the server-provided ISO string so client + server
  // hydrate from the same value, then refresh every minute on the client.
  const [now, setNow] = useState(() => new Date(nowIso));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

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
          <Sparkles className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Próximos</span>
          <span className="sm:hidden">Próx.</span>
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <CalendarHeart className="h-4 w-4 mr-1" />
          Mês
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Histórico</span>
          <span className="sm:hidden">Hist.</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <Empty
            title="Nada por vir 🌷"
            description="Agenda livre — aproveita o ventinho na cara."
          />
        ) : (
          <UpcomingTimeline events={upcoming} nowIso={now.toISOString()} />
        )}
      </TabsContent>

      <TabsContent value="calendar" className="space-y-4">
        <MonthCalendar
          events={events}
          nowIso={now.toISOString()}
          selectedDay={selectedDay}
          onSelect={(d) => setSelectedDay(d)}
        />
        {selectedDay && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between flex-wrap gap-2">
                <span className="capitalize">
                  {format(selectedDay, "EEEE, d 'de' MMMM", { locale: ptBR })}
                </span>
                <EventForm
                  initialDate={selectedDay}
                  triggerLabel="Adicionar"
                  triggerVariant="soft"
                  triggerSize="sm"
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dayEvents.length === 0 ? (
                <p className="text-sm text-[var(--muted-fg)] py-3 text-center">
                  Sem nada nesse dia 🌷
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
          <Empty
            title="Sem histórico ainda"
            description="O que passou aparece aqui depois."
          />
        ) : (
          <PastList events={past} />
        )}
      </TabsContent>
    </Tabs>
  );
}

function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
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
