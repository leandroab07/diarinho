"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  NotificationChannel,
  ReminderUnit,
} from "@/lib/database.types";

const UNITS: ReminderUnit[] = ["minutes", "hours", "days"];
const CHANNELS: NotificationChannel[] = ["site", "sound", "email", "whatsapp"];

export type ReminderInput = {
  id?: string;
  unit: ReminderUnit;
  value: number;
  channels: NotificationChannel[];
};

export type EventPayload = {
  id?: string;
  title: string;
  description?: string;
  location?: string;
  color: string;
  starts_at: string;
  ends_at?: string | null;
  all_day: boolean;
  reminders: ReminderInput[];
};

function sanitizeReminders(input: ReminderInput[]): ReminderInput[] {
  return input
    .filter((r) => UNITS.includes(r.unit))
    .map((r) => ({
      id: r.id,
      unit: r.unit,
      value: Math.max(0, Math.min(365, Math.floor(r.value || 0))),
      channels: (r.channels ?? []).filter((c) =>
        CHANNELS.includes(c),
      ) as NotificationChannel[],
    }))
    .filter((r) => r.channels.length > 0);
}

export async function saveEvent(payload: EventPayload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("não autenticado");

  const reminders = sanitizeReminders(payload.reminders);

  if (payload.id) {
    await supabase
      .from("events")
      .update({
        title: payload.title,
        description: payload.description ?? null,
        location: payload.location ?? null,
        color: payload.color,
        starts_at: payload.starts_at,
        ends_at: payload.ends_at ?? null,
        all_day: payload.all_day,
      })
      .eq("id", payload.id);

    await supabase.from("event_reminders").delete().eq("event_id", payload.id);
    if (reminders.length) {
      await supabase.from("event_reminders").insert(
        reminders.map((r) => ({
          event_id: payload.id!,
          user_id: user.id,
          unit: r.unit,
          value: r.value,
          channels: r.channels,
        })),
      );
    }
  } else {
    const { data: created } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        title: payload.title,
        description: payload.description ?? null,
        location: payload.location ?? null,
        color: payload.color,
        starts_at: payload.starts_at,
        ends_at: payload.ends_at ?? null,
        all_day: payload.all_day,
      })
      .select("id")
      .single();

    if (created && reminders.length) {
      await supabase.from("event_reminders").insert(
        reminders.map((r) => ({
          event_id: created.id,
          user_id: user.id,
          unit: r.unit,
          value: r.value,
          channels: r.channels,
        })),
      );
    }
  }

  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/agenda");
  revalidatePath("/");
}
