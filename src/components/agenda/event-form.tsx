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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Bell, BellRing, PenLine } from "lucide-react";
import { toast } from "sonner";
import { saveEvent, type ReminderInput } from "@/app/(app)/agenda/actions";
import type {
  NotificationChannel,
  ReminderUnit,
  Database,
} from "@/lib/database.types";

type Event = Database["public"]["Tables"]["events"]["Row"];
type Reminder = Database["public"]["Tables"]["event_reminders"]["Row"];

const COLORS = [
  "#ec88a3", // rosa
  "#c9a8e0", // lilás
  "#ffd4b3", // pêssego
  "#6ec9a8", // menta
  "#87c3e8", // azul-bebê
  "#fff4b3", // amarelo
  "#f5b8d1", // rosa-bb
  "#a8a4f5", // lavanda
];

const CHANNELS: { key: NotificationChannel; label: string; emoji: string }[] = [
  { key: "site", label: "Destacar no site", emoji: "✨" },
  { key: "sound", label: "Tocar um som", emoji: "🔔" },
  { key: "email", label: "E-mail", emoji: "✉️" },
  { key: "whatsapp", label: "WhatsApp", emoji: "💬" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toTimeInput(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({
  event,
  reminders: existingReminders,
  initialDate,
  triggerLabel,
  triggerVariant = "default",
  triggerSize = "default",
}: {
  event?: Event;
  reminders?: Reminder[];
  initialDate?: Date;
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "ghost";
  triggerSize?: "default" | "sm";
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const initialStart = event
    ? new Date(event.starts_at)
    : initialDate ?? new Date();
  const initialEnd = event?.ends_at
    ? new Date(event.ends_at)
    : new Date(initialStart.getTime() + 60 * 60 * 1000);

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [color, setColor] = useState(event?.color ?? COLORS[0]);
  const [allDay, setAllDay] = useState(event?.all_day ?? false);
  const [startDate, setStartDate] = useState(toDateInput(initialStart));
  const [startTime, setStartTime] = useState(toTimeInput(initialStart));
  const [endDate, setEndDate] = useState(toDateInput(initialEnd));
  const [endTime, setEndTime] = useState(toTimeInput(initialEnd));
  const [hasEnd, setHasEnd] = useState(!!event?.ends_at);

  const [reminders, setReminders] = useState<ReminderInput[]>(
    existingReminders?.map((r) => ({
      id: r.id,
      unit: r.unit as ReminderUnit,
      value: r.value,
      channels: r.channels as NotificationChannel[],
    })) ?? [
      { unit: "hours", value: 1, channels: ["site", "sound"] },
    ],
  );

  function updateReminder(idx: number, patch: Partial<ReminderInput>) {
    setReminders((rs) => rs.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  function toggleChannel(idx: number, channel: NotificationChannel) {
    setReminders((rs) =>
      rs.map((r, i) => {
        if (i !== idx) return r;
        const has = r.channels.includes(channel);
        return {
          ...r,
          channels: has
            ? r.channels.filter((c) => c !== channel)
            : [...r.channels, channel],
        };
      }),
    );
  }

  function addReminder() {
    setReminders((rs) => [
      ...rs,
      { unit: "minutes", value: 30, channels: ["site"] },
    ]);
  }

  function removeReminder(idx: number) {
    setReminders((rs) => rs.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Dá um nome ao seu evento 💕");
      return;
    }

    const starts_at = allDay
      ? new Date(`${startDate}T00:00:00`).toISOString()
      : new Date(`${startDate}T${startTime}:00`).toISOString();

    let ends_at: string | null = null;
    if (allDay) {
      ends_at = new Date(`${startDate}T23:59:59`).toISOString();
    } else if (hasEnd) {
      ends_at = new Date(`${endDate}T${endTime}:00`).toISOString();
    }

    setPending(true);
    try {
      await saveEvent({
        id: event?.id,
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        color,
        starts_at,
        ends_at,
        all_day: allDay,
        reminders,
      });
      toast.success(event ? "Evento atualizado ✨" : "Evento criado 🎀");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Ops 🥺", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize}>
          {event ? <PenLine className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {triggerLabel ?? (event ? "Editar" : "Novo compromisso")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {event ? "Editar compromisso" : "Novo compromisso 🎀"}
          </DialogTitle>
          <DialogDescription>
            Preenche o que importa — depois você ajusta os lembretes do jeitinho
            que quiser.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Café com a Bia"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="location">Local (opcional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Padaria da esquina"
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-all",
                      color === c
                        ? "border-[var(--fg)] scale-110 ring-2 ring-[var(--ring)]/30"
                        : "border-[var(--border)]",
                    )}
                    style={{ background: c }}
                    aria-label={`cor ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-[var(--muted)] p-3">
            <div>
              <Label htmlFor="all_day" className="cursor-pointer">
                Dia inteiro
              </Label>
              <p className="text-xs text-[var(--muted-fg)]">
                Sem horário específico
              </p>
            </div>
            <Switch
              id="all_day"
              checked={allDay}
              onCheckedChange={setAllDay}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Início</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              {!allDay && (
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Fim (opcional)</Label>
                {!allDay && (
                  <button
                    type="button"
                    className="text-xs text-[var(--primary)] font-semibold"
                    onClick={() => setHasEnd((v) => !v)}
                  >
                    {hasEnd ? "remover" : "adicionar"}
                  </button>
                )}
              </div>
              {hasEnd && !allDay && (
                <>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detalhes (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Levar o caderno, lembrar de pagar a..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-[var(--primary)]" />
                Lembretes
              </Label>
              <Button
                type="button"
                size="sm"
                variant="soft"
                onClick={addReminder}
              >
                <Plus className="h-3 w-3" /> Adicionar
              </Button>
            </div>
            {reminders.length === 0 && (
              <p className="text-sm text-[var(--muted-fg)] text-center py-3">
                Nenhum lembrete configurado
              </p>
            )}
            <div className="space-y-3">
              {reminders.map((r, idx) => (
                <ReminderRow
                  key={idx}
                  reminder={r}
                  onChange={(patch) => updateReminder(idx, patch)}
                  onToggleChannel={(c) => toggleChannel(idx, c)}
                  onRemove={() => removeReminder(idx)}
                />
              ))}
            </div>
            <p className="text-xs text-[var(--muted-fg)] px-2">
              💡 Dias considera só o calendário (não o horário marcado). Horas e
              minutos consideram o momento exato.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
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

function ReminderRow({
  reminder,
  onChange,
  onToggleChannel,
  onRemove,
}: {
  reminder: ReminderInput;
  onChange: (patch: Partial<ReminderInput>) => void;
  onToggleChannel: (c: NotificationChannel) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-[var(--border)] bg-[var(--card)] p-3 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold flex items-center gap-1.5">
          <Bell className="h-4 w-4 text-[var(--primary)]" />
          Avisar
        </span>
        <Input
          type="number"
          min={0}
          max={365}
          value={reminder.value}
          onChange={(e) =>
            onChange({ value: parseInt(e.target.value, 10) || 0 })
          }
          className="h-9 w-20"
        />
        <Select
          value={reminder.unit}
          onValueChange={(v) => onChange({ unit: v as ReminderUnit })}
        >
          <SelectTrigger className="h-9 w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">minutos antes</SelectItem>
            <SelectItem value="hours">horas antes</SelectItem>
            <SelectItem value="days">dias antes</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4 text-[var(--danger)]" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CHANNELS.map((c) => {
          const active = reminder.channels.includes(c.key);
          const isTodo = c.key === "email" || c.key === "whatsapp";
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onToggleChannel(c.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-semibold transition-all",
                active
                  ? "bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]"
                  : "bg-[var(--muted)] border-[var(--border)]",
              )}
              title={
                isTodo
                  ? "(em breve) envio real ainda não está conectado"
                  : undefined
              }
            >
              <span>{c.emoji}</span>
              {c.label}
              {isTodo && active && (
                <span className="text-[10px] opacity-70">(em breve)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
