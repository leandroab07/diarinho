"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteEntry } from "@/app/(app)/diario/actions";
import { EntryEditor } from "@/components/diary/entry-editor";
import type { Database } from "@/lib/database.types";

const MOOD_EMOJI: Record<string, string> = {
  feliz: "😊",
  animado: "🤩",
  grato: "🥹",
  calmo: "😌",
  neutro: "😐",
  ansioso: "😰",
  triste: "🥺",
  irritado: "😤",
};

export function EntryCard({
  entry,
}: {
  entry: Database["public"]["Tables"]["diary_entries"]["Row"];
}) {
  const router = useRouter();
  const date = new Date(entry.entry_date + "T00:00:00");

  async function handleDelete() {
    if (!confirm("Tem certeza que quer apagar essa anotação?")) return;
    await deleteEntry(entry.id);
    toast.success("Anotação apagada");
    router.refresh();
  }

  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs text-[var(--muted-fg)]">
              {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <CardTitle className="text-xl">
              {entry.mood && (
                <span className="mr-2">{MOOD_EMOJI[entry.mood]}</span>
              )}
              {entry.title || "Anotação"}
            </CardTitle>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <EntryEditor entry={entry} triggerLabel=" " triggerVariant="ghost" />
            <Button variant="ghost" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-[var(--danger)]" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm whitespace-pre-wrap leading-relaxed font-handwriting text-lg">
          {entry.content}
        </p>
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((t) => (
              <Badge key={t} variant="soft">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
