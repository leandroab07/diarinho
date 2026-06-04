"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "não autenticado" };

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: (formData.get("display_name") as string) || null,
        bio: (formData.get("bio") as string) || null,
        notify_sound: formData.get("notify_sound") === "on",
        notify_email: formData.get("notify_email") === "on",
        notify_whatsapp: formData.get("notify_whatsapp") === "on",
        contact_email: (formData.get("contact_email") as string) || null,
        whatsapp_number: (formData.get("whatsapp_number") as string) || null,
      })
      .eq("id", user.id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/configuracoes");
    revalidatePath("/");
    revalidatePath("/diario");
    revalidatePath("/agenda");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "erro inesperado",
    };
  }
}

/** Saves the avatar URL on the user profile (the file itself is uploaded by the browser). */
export async function setAvatarUrl(url: string | null): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "não autenticado" };
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/configuracoes");
    revalidatePath("/");
    revalidatePath("/diario");
    revalidatePath("/agenda");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "erro inesperado",
    };
  }
}
