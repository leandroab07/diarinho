import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ThemeSwitcherInline } from "@/components/theme-switcher";
import {
  Settings,
  Palette,
  Bell,
  User2,
  Volume2,
  Mail,
  ImageIcon,
} from "lucide-react";
import { AvatarUpload } from "@/components/avatar-upload";
import { TestSoundButton } from "@/components/test-sound-button";
import { ProfileSaveButton } from "@/components/profile-save-button";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.display_name || user.email?.split("@")[0] || "amigo(a)";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="inline-flex h-12 w-12 rounded-2xl bg-[var(--primary)]/15 items-center justify-center animate-float">
            <Settings className="h-7 w-7 text-[var(--primary)]" />
          </span>
          Ajustes
        </h1>
        <p className="text-[var(--muted-fg)] mt-1">
          Deixa do seu jeitinho ✨
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-[var(--accent)]" />
            Foto de perfil
          </CardTitle>
          <CardDescription>
            Aparece na sua barra lateral pra deixar tudo seu jeito.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            userId={user.id}
            currentUrl={profile?.avatar_url ?? null}
            displayName={displayName}
          />
        </CardContent>
      </Card>

      <ProfileForm
        defaults={{
          display_name: profile?.display_name ?? "",
          bio: profile?.bio ?? "",
          contact_email: profile?.contact_email ?? user.email ?? "",
          whatsapp_number: profile?.whatsapp_number ?? "",
          notify_sound: profile?.notify_sound ?? true,
          notify_email: profile?.notify_email ?? false,
          notify_whatsapp: profile?.notify_whatsapp ?? false,
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[var(--accent)]" />
            Tema visual
          </CardTitle>
          <CardDescription>
            Escolha a paleta. Você troca quando quiser pelo topo também.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSwitcherInline />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Mail className="h-4 w-4 text-[var(--muted-fg)]" />
            Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-[var(--muted-fg)]">Email:</span>{" "}
            <strong>{user.email}</strong>
          </p>
          <p className="text-xs text-[var(--muted-fg)]">
            ID: <code>{user.id.slice(0, 8)}…</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

type ProfileDefaults = {
  display_name: string;
  bio: string;
  contact_email: string;
  whatsapp_number: string;
  notify_sound: boolean;
  notify_email: boolean;
  notify_whatsapp: boolean;
};

function ProfileForm({ defaults }: { defaults: ProfileDefaults }) {
  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5 text-[var(--primary)]" />
            Sobre você
          </CardTitle>
          <CardDescription>
            Nome, bio e canais de contato.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Nome de exibição</Label>
            <Input
              id="display_name"
              name="display_name"
              defaultValue={defaults.display_name}
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio / frase favorita</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={defaults.bio}
              placeholder="Plante sementinhas hoje e regue todo dia 🌱"
              maxLength={160}
              className="min-h-[80px]"
            />
            <p className="text-[10px] text-[var(--muted-fg)] text-right">
              até 160 caracteres
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="contact_email">E-mail para avisos</Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                defaultValue={defaults.contact_email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp (com DDI)</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                defaultValue={defaults.whatsapp_number}
                placeholder="+5511999998888"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="h-6" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--accent)]" />
            Notificações padrão
          </CardTitle>
          <CardDescription>
            Canais sugeridos quando você cria um lembrete.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingToggle
            icon={<Volume2 className="h-5 w-5 text-[var(--primary)]" />}
            name="notify_sound"
            label="Tocar som no site"
            description="Sininho fofo quando um lembrete dispara"
            defaultChecked={defaults.notify_sound}
          />
          <SettingToggle
            icon="✉️"
            name="notify_email"
            label="Avisar por e-mail"
            description="Receber também por e-mail"
            defaultChecked={defaults.notify_email}
            badge="em breve"
          />
          <SettingToggle
            icon="💬"
            name="notify_whatsapp"
            label="Avisar por WhatsApp"
            description="Aviso direto no seu Zap"
            defaultChecked={defaults.notify_whatsapp}
            badge="em breve"
          />

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <ProfileSaveButton />
            <TestSoundButton />
          </div>
          <p className="text-xs text-[var(--muted-fg)] pt-2">
            💡 Os envios reais por e-mail e WhatsApp ainda estão sendo
            ligados. A UI já guarda sua preferência.
          </p>
        </CardContent>
      </Card>
    </form>
  );
}

function SettingToggle({
  name,
  label,
  description,
  defaultChecked,
  icon,
  badge,
}: {
  name: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--muted)] p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icon}</span>
        <div>
          <p className="font-semibold flex items-center gap-2">
            {label}
            {badge && <Badge variant="peach">{badge}</Badge>}
          </p>
          <p className="text-xs text-[var(--muted-fg)]">{description}</p>
        </div>
      </div>
      <Switch name={name} defaultChecked={defaultChecked} />
    </div>
  );
}
