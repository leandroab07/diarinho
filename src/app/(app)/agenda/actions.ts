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

export type ActionResult = { ok: true } | { ok: false; error: string };

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

export async function saveEvent(payload: EventPayload): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "não autenticado" };

    if (!payload.title?.trim()) {
      return { ok: false, error: "título é obrigatório" };
    }

    const reminders = sanitizeReminders(payload.reminders);

    if (payload.id) {
      const { error: updErr } = await supabase
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
      if (updErr) return { ok: false, error: updErr.message };

      const { error: delErr } = await supabase
        .from("event_reminders")
        .delete()
        .eq("event_id", payload.id);
      if (delErr) return { ok: false, error: delErr.message };

      if (reminders.length) {
        const { error: insErr } = await supabase
          .from("event_reminders")
          .insert(
            reminders.map((r) => ({
              event_id: payload.id!,
              user_id: user.id,
              unit: r.unit,
              value: r.value,
              channels: r.channels,
            })),
          );
        if (insErr) return { ok: false, error: insErr.message };
      }
    } else {
      const { data: created, error: insErr } = await supabase
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

      if (insErr || !created) {
        return { ok: false, error: insErr?.message ?? "falha ao criar evento" };
      }

      if (reminders.length) {
        const { error: rInsErr } = await supabase
          .from("event_reminders")
          .insert(
            reminders.map((r) => ({
              event_id: created.id,
              user_id: user.id,
              unit: r.unit,
              value: r.value,
              channels: r.channels,
            })),
          );
        if (rInsErr) return { ok: false, error: rInsErr.message };
      }
    }

    revalidatePath("/agenda");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "erro inesperado",
    };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/agenda");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "erro inesperado",
    };
  }
}

export async function dismissReminder(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("event_reminders")
      .update({ dismissed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/agenda");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "erro inesperado",
    };
  }
}

export async function snoozeReminder(
  id: string,
  minutes: number,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const until = new Date(Date.now() + minutes * 60_000).toISOString();
    const { error } = await supabase
      .from("event_reminders")
      .update({ dismissed_at: until })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/agenda");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "erro inesperado",
    };
  }
}
