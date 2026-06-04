import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNowStrict,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type {
  Database,
  ReminderUnit,
  NotificationChannel,
} from "@/lib/database.types";

export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type ReminderRow =
  Database["public"]["Tables"]["event_reminders"]["Row"];

export type EventWithReminders = EventRow & {
  reminders: ReminderRow[];
};

export type ReminderStatus = {
  /** True when the reminder is currently inside its triggering window (and event hasn't passed). */
  active: boolean;
  /** Distance amount considering the reminder's unit. days mode ignores time of day. */
  amount: number;
  unit: ReminderUnit;
  /** Pretty human label, e.g. "em 2 dias", "em 3 horas". */
  label: string;
};

/**
 * Returns the unit-aware distance between now and the event start.
 * - For unit="days", we use *calendar* days (ignoring time of day),
 *   so a reminder set to "1 day before" highlights as soon as we enter
 *   the previous calendar date — not exactly 24h before.
 */
export function distanceForReminder(
  now: Date,
  eventStart: Date,
  unit: ReminderUnit,
): number {
  if (unit === "days") {
    return differenceInCalendarDays(startOfDay(eventStart), startOfDay(now));
  }
  if (unit === "hours") {
    return differenceInHours(eventStart, now);
  }
  return differenceInMinutes(eventStart, now);
}

export function reminderStatus(
  reminder: ReminderRow,
  event: EventRow,
  now: Date = new Date(),
): ReminderStatus {
  const eventStart = new Date(event.starts_at);
  const amount = distanceForReminder(now, eventStart, reminder.unit);
  // Active when: event still upcoming AND the configured threshold has been reached.
  const stillUpcoming = isAfter(eventStart, now) || sameCalendarDay(now, eventStart);
  const active = stillUpcoming && amount <= reminder.value && amount >= 0;
  const label = humanLabel(amount, reminder.unit);
  return { active, amount, unit: reminder.unit, label };
}

function sameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function humanLabel(amount: number, unit: ReminderUnit): string {
  if (amount < 0) return "já passou";
  if (amount === 0) {
    if (unit === "days") return "hoje! 🎉";
    if (unit === "hours") return "em menos de 1h";
    return "agora";
  }
  const plural = amount > 1;
  if (unit === "days") return `em ${amount} dia${plural ? "s" : ""}`;
  if (unit === "hours") return `em ${amount} hora${plural ? "s" : ""}`;
  return `em ${amount} min`;
}

export function prettyEventDistance(starts_at: string) {
  return formatDistanceToNowStrict(new Date(starts_at), {
    addSuffix: true,
    locale: ptBR,
  });
}

export function isUpcoming(event: EventRow, now: Date = new Date()) {
  const start = new Date(event.starts_at);
  return isAfter(start, now) || sameCalendarDay(start, now);
}

export function isPast(event: EventRow, now: Date = new Date()) {
  const end = event.ends_at ? new Date(event.ends_at) : new Date(event.starts_at);
  return isBefore(end, now) && !sameCalendarDay(end, now);
}

export function channelsOf(reminder: ReminderRow): NotificationChannel[] {
  return (reminder.channels ?? []) as NotificationChannel[];
}

export function maxActiveStatus(
  reminders: ReminderRow[],
  event: EventRow,
  now: Date = new Date(),
): ReminderStatus | null {
  let best: ReminderStatus | null = null;
  for (const r of reminders) {
    const s = reminderStatus(r, event, now);
    if (s.active) {
      if (!best || s.amount < best.amount) best = s;
    }
  }
  return best;
}
