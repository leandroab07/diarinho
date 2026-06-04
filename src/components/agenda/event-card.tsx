"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/agenda/event-form";
import { deleteEvent } from "@/app/(app)/agenda/actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  maxActiveStatus,
  prettyEventDistance,
  type EventRow,
  type ReminderRow,
} from "@/lib/reminders";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  reminders,
}: {
  event: EventRow;
  reminders: ReminderRow[];
}) {
  const router = useRouter();
  const now = new Date();
  const status = maxActiveStatus(reminders, event, now);
  const start = new Date(event.starts_at);

  async function handleDelete() {
    if (!confirm("Apagar esse compromisso?")) return;
    await deleteEvent(event.id);
    toast.success("Compromisso apagado");
    router.refresh();
  }

  return (
    <Card
      className={cn(
        "group transition-all hover:shadow-lg",
        status && "animate-pulse-soft",
      )}
      style={{ borderColor: event.color }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <span
            className="h-10 w-1.5 rounded-full shrink-0"
            style={{ background: event.color }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              {status && <Badge variant="default">⏰ {status.label}</Badge>}
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--muted-fg)] flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.all_day
                  ? format(start, "d 'de' MMM • dia inteiro", { locale: ptBR })
                  : format(start, "d 'de' MMM 'às' HH:mm", { locale: ptBR })}
              </span>
              <span>· {prettyEventDistance(event.starts_at)}</span>
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <EventForm
              event={event}
              reminders={reminders}
              triggerLabel=" "
              triggerVariant="ghost"
              triggerSize="sm"
            />
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-[var(--danger)]" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {(event.description || reminders.length > 0) && (
        <CardContent className="pt-0 space-y-2">
          {event.description && (
            <p className="text-sm text-[var(--muted-fg)] whitespace-pre-wrap">
              {event.description}
            </p>
          )}
          {reminders.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {reminders.map((r) => (
                <Badge key={r.id} variant="soft">
                  🔔 {r.value}{" "}
                  {r.unit === "minutes"
                    ? "min"
                    : r.unit === "hours"
                      ? "h"
                      : "dias"}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
