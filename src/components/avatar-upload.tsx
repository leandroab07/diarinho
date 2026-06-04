"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { setAvatarUrl } from "@/app/(app)/configuracoes/actions";
import { Button } from "@/components/ui/button";
import { Camera, Trash2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function AvatarUpload({
  userId,
  currentUrl,
  displayName,
}: {
  userId: string;
  currentUrl: string | null;
  displayName: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl);

  const initial = (displayName || "?").trim().charAt(0).toUpperCase();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      toast.error("Formato inválido", {
        description: "PNG, JPG, WebP ou GIF",
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Arquivo grande demais 🥺", {
        description: "Máximo 2MB",
      });
      return;
    }

    setBusy(true);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${userId}/avatar-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (upErr) {
        toast.error("Upload falhou 🥺", { description: upErr.message });
        setPreview(currentUrl);
        return;
      }

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const result = await setAvatarUrl(pub.publicUrl);
      if (!result.ok) {
        toast.error("Não consegui salvar no perfil", {
          description: result.error,
        });
        setPreview(currentUrl);
        return;
      }
      toast.success("Foto atualizada ✨");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    if (!confirm("Remover sua foto de perfil?")) return;
    setBusy(true);
    const result = await setAvatarUrl(null);
    setBusy(false);
    if (!result.ok) {
      toast.error("Não consegui remover", { description: result.error });
      return;
    }
    setPreview(null);
    toast.success("Foto removida");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <div
          className="h-24 w-24 rounded-full border-4 border-[var(--primary)] bg-[var(--muted)] overflow-hidden shadow-[var(--shadow-soft)] flex items-center justify-center"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-handwriting text-5xl text-[var(--primary)]">
              {initial}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-[var(--primary)] text-[var(--primary-fg)] flex items-center justify-center shadow-[var(--shadow-soft)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
          aria-label="Trocar foto"
          title="Trocar foto"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold mb-1">Foto de perfil</p>
        <p className="text-xs text-[var(--muted-fg)] mb-3">
          PNG, JPG, WebP ou GIF — até 2MB. Aparece na sua barra lateral.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            size="sm"
            variant="soft"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <ImagePlus className="h-4 w-4" />
            {preview ? "Trocar" : "Escolher foto"}
          </Button>
          {preview && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              disabled={busy}
            >
              <Trash2 className="h-4 w-4 text-[var(--danger)]" />
              Remover
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
