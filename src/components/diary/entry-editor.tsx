"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoodPicker } from "@/components/diary/mood-picker";
import { PaperPicker } from "@/components/diary/paper-picker";
import { PaperTextarea } from "@/components/diary/paper-textarea";
import { PenLine, Plus } from "lucide-react";
import { toast } from "sonner";
import { saveEntry } from "@/app/(app)/diario/actions";
import type { Database, Mood, PaperStyle } from "@/lib/database.types";

type Entry = Database["public"]["Tables"]["diary_entries"]["Row"];

export function EntryEditor({
  entry,
  triggerLabel,
  triggerVariant = "default",
}: {
  entry?: Entry;
  triggerLabel?: string;
  triggerVariant?: "default" | "ghost" | "outline";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    try {
      await saveEntry(formData);
      toast.success(entry ? "Anotação atualizada ✨" : "Anotação guardadinha 💖");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Não consegui salvar 🥺", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          {entry ? <PenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {triggerLabel ?? (entry ? "Editar" : "Escrever no diário")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entry ? "Editar anotação" : "Como foi seu dia? 🌸"}
          </DialogTitle>
          <DialogDescription>
            Sem pressão, escreva o que tiver vontade.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          {entry && <input type="hidden" name="id" value={entry.id} />}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="entry_date">Data</Label>
              <Input
                id="entry_date"
                name="entry_date"
                type="date"
                required
                defaultValue={
                  entry?.entry_date ?? new Date().toISOString().slice(0, 10)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título (opcional)</Label>
              <Input
                id="title"
                name="title"
                placeholder="Um dia tranquilo..."
                defaultValue={entry?.title ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Como você se sente?</Label>
            <MoodPicker defaultValue={entry?.mood as Mood | undefined} />
          </div>

          <div className="space-y-2">
            <Label>Estilo do papel</Label>
            <PaperPicker
              defaultValue={(entry?.paper_style ?? "plain") as PaperStyle}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">O que rolou hoje?</Label>
            <PaperTextarea
              id="content"
              name="content"
              placeholder="Comecei o dia tomando um café gostoso enquanto..."
              defaultValue={entry?.content ?? ""}
              required
              defaultPaperStyle={
                (entry?.paper_style ?? "plain") as PaperStyle
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="trabalho, amigos, café"
              defaultValue={entry?.tags?.join(", ") ?? ""}
            />
            <p className="text-[10px] text-[var(--muted-fg)]">
              elas aparecem como #chips embaixo da publicação 🎀
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar 💾"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
