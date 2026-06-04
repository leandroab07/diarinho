import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookHeart,
  CalendarHeart,
  Sparkles,
  PenLine,
  Plus,
  Clock,
} from "lucide-react";
import {
  type EventRow,
  type ReminderRow,
  maxActiveStatus,
  prettyEventDistance,
} from "@/lib/reminders";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: events }, { data: latest }] = await Promise.all([
    supabase
      .from("events")
      .select("*, event_reminders(*)")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(8),
    supabase
      .from("diary_entries")
      .select("*")
      .order("entry_date", { ascending: false })
      .limit(3),
  ]);

  const upcoming =
    (events as (EventRow & { event_reminders: ReminderRow[] })[]) ?? [];

  const now = new Date();
  const highlighted = upcoming.filter(
    (ev) => !!maxActiveStatus(ev.event_reminders ?? [], ev, now),
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-[var(--muted-fg)] text-sm">
          {format(now, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-[var(--primary)] animate-float" />
          Oi, que dia bonito! 🌸
        </h1>
      </header>

      {highlighted.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--accent)]" />
            Tá chegando!
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {highlighted.map((ev) => {
              const status = maxActiveStatus(
                ev.event_reminders ?? [],
                ev,
                now,
              )!;
              return (
                <Card
                  key={ev.id}
                  className="border-[var(--primary)] animate-pulse-soft"
                  style={{ borderColor: ev.color }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{ev.title}</CardTitle>
                      <Badge variant="default">⏰ {status.label}</Badge>
                    </div>
                    <CardDescription>
                      {format(
                        new Date(ev.starts_at),
                        "d 'de' MMM • HH:mm",
                        { locale: ptBR },
                      )}
                    </CardDescription>
                  </CardHeader>
                  {ev.description && (
                    <CardContent className="pt-0 text-sm text-[var(--muted-fg)] line-clamp-2">
                      {ev.description}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarHeart className="h-5 w-5 text-[var(--primary)]" />
                Próximos compromissos
              </CardTitle>
              <Button asChild size="sm" variant="ghost">
                <Link href="/agenda">
                  <Plus className="h-4 w-4" /> Novo
                </Link>
              </Button>
            </div>
            <CardDescription>
              {upcoming.length === 0
                ? "Tua agenda tá livre, aproveita!"
                : `${upcoming.length} eventos pelo caminho`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && (
              <div className="text-sm text-[var(--muted-fg)] py-6 text-center">
                Nadinha por enquanto 🌷
              </div>
            )}
            {upcoming.slice(0, 5).map((ev) => (
              <Link
                key={ev.id}
                href="/agenda"
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[var(--muted)] transition-all"
              >
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ background: ev.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{ev.title}</p>
                  <p className="text-xs text-[var(--muted-fg)]">
                    {prettyEventDistance(ev.starts_at)}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookHeart className="h-5 w-5 text-[var(--accent)]" />
                Diário recente
              </CardTitle>
              <Button asChild size="sm" variant="ghost">
                <Link href="/diario">
                  <PenLine className="h-4 w-4" /> Escrever
                </Link>
              </Button>
            </div>
            <CardDescription>
              {latest && latest.length > 0
                ? `Sua última entrada: ${format(new Date(latest[0].entry_date), "d 'de' MMM", { locale: ptBR })}`
                : "Que tal começar registrando hoje?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(latest ?? []).map((entry) => (
              <Link
                key={entry.id}
                href="/diario"
                className="block p-3 rounded-2xl hover:bg-[var(--muted)] transition-all"
              >
                <div className="flex items-center gap-2 text-xs text-[var(--muted-fg)] mb-1">
                  <span>
                    {format(new Date(entry.entry_date), "d MMM", {
                      locale: ptBR,
                    })}
                  </span>
                  {entry.mood && <Badge variant="soft">{entry.mood}</Badge>}
                </div>
                <p className="text-sm line-clamp-2">
                  {entry.title || entry.content.slice(0, 120) || "(vazio)"}
                </p>
              </Link>
            ))}
            {(!latest || latest.length === 0) && (
              <div className="text-sm text-[var(--muted-fg)] py-6 text-center">
                Sua história começa aqui 💖
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
