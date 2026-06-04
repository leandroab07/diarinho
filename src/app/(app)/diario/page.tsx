import { createClient } from "@/lib/supabase/server";
import { EntryEditor } from "@/components/diary/entry-editor";
import { EntryCard } from "@/components/diary/entry-card";
import { BookHeart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DiarioPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("diary_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .limit(120);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <BookHeart className="h-8 w-8 text-[var(--accent)]" />
            Diário
          </h1>
          <p className="text-[var(--muted-fg)] mt-1">
            Suas anotações em ordem cronológica 🌷
          </p>
        </div>
        <EntryEditor />
      </header>

      {(!entries || entries.length === 0) ? (
        <Card>
          <CardHeader className="text-center py-12">
            <div className="mx-auto h-14 w-14 rounded-full bg-[var(--muted)] flex items-center justify-center mb-2 animate-float">
              <BookHeart className="h-7 w-7 text-[var(--primary)]" />
            </div>
            <CardTitle>Ainda sem anotações</CardTitle>
            <CardDescription>
              Que tal começar registrando como foi seu dia?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <EntryEditor triggerLabel="Escrever a primeira ✨" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
