"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("não autenticado");

  await supabase
    .from("profiles")
    .update({
      display_name: (formData.get("display_name") as string) || null,
      notify_sound: formData.get("notify_sound") === "on",
      notify_email: formData.get("notify_email") === "on",
      notify_whatsapp: formData.get("notify_whatsapp") === "on",
      contact_email: (formData.get("contact_email") as string) || null,
      whatsapp_number: (formData.get("whatsapp_number") as string) || null,
    })
    .eq("id", user.id);

  revalidatePath("/configuracoes");
  revalidatePath("/");
}
