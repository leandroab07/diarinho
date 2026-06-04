"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Mood } from "@/lib/database.types";

const ALLOWED_MOODS: Mood[] = [
  "feliz",
  "calmo",
  "neutro",
  "ansioso",
  "triste",
  "irritado",
  "grato",
  "animado",
];

function parseMood(v: FormDataEntryValue | null): Mood | null {
  if (!v) return null;
  const s = String(v);
  return (ALLOWED_MOODS as string[]).includes(s) ? (s as Mood) : null;
}

function parseTags(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export async function saveEntry(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("não autenticado");

  const id = formData.get("id");
  const entry_date = String(formData.get("entry_date"));
  const title = (formData.get("title") as string | null) || null;
  const content = String(formData.get("content") ?? "");
  const mood = parseMood(formData.get("mood"));
  const tags = parseTags(formData.get("tags"));

  if (id) {
    await supabase
      .from("diary_entries")
      .update({ entry_date, title, content, mood, tags })
      .eq("id", String(id));
  } else {
    await supabase.from("diary_entries").insert({
      user_id: user.id,
      entry_date,
      title,
      content,
      mood,
      tags,
    });
  }

  revalidatePath("/diario");
  revalidatePath("/");
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  await supabase.from("diary_entries").delete().eq("id", id);
  revalidatePath("/diario");
  revalidatePath("/");
}
