"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { updateProfile } from "@/app/(app)/configuracoes/actions";

export function ProfileSaveButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest("form");
    if (!form) return;
    setPending(true);
    const result = await updateProfile(new FormData(form));
    setPending(false);
    if (!result.ok) {
      toast.error("Não consegui salvar 🥺", { description: result.error });
      return;
    }
    toast.success("Tudo salvo 💖");
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleClick} disabled={pending}>
      <Save className="h-4 w-4" />
      {pending ? "Salvando..." : "Salvar preferências"}
    </Button>
  );
}
