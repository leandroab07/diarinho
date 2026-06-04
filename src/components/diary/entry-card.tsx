"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Tag as TagIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteEntry } from "@/app/(app)/diario/actions";
import { EntryEditor } from "@/components/diary/entry-editor";
import { paperClass } from "@/lib/paper-styles";
import type { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";

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
    <Card className="group hover:shadow-lg transition-all overflow-hidden">
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

      <CardContent className="space-y-4">
        {/* Conteúdo num "papel" do estilo escolhido */}
        <div
          className={cn(
            "rounded-2xl border-2 border-[var(--border)] p-5 leading-[28px] text-base whitespace-pre-wrap font-handwriting text-xl text-[var(--card-fg)]",
            paperClass(entry.paper_style),
          )}
        >
          {entry.content}
        </div>

        {/* Tags: chips com # rosa */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-1 border-t border-dashed border-[var(--border)]">
            <TagIcon className="h-4 w-4 text-[var(--muted-fg)] mr-0.5" />
            {entry.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center text-sm font-semibold rounded-full px-3 py-1 bg-[var(--primary)]/12 border-2 border-[var(--primary)]/30 text-[var(--card-fg)] transition-all hover:scale-105 hover:bg-[var(--primary)]/20"
              >
                <span className="text-[var(--primary)] font-bold mr-0.5">#</span>
                {t}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
