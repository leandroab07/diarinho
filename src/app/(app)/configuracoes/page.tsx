import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcherInline } from "@/components/theme-switcher";
import { Settings, Palette, Bell, User2, Volume2, TestTube } from "lucide-react";
import { updateProfile } from "@/app/(app)/configuracoes/actions";
import { TestSoundButton } from "@/components/test-sound-button";

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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Settings className="h-8 w-8 text-[var(--primary)]" />
          Ajustes
        </h1>
        <p className="text-[var(--muted-fg)] mt-1">
          Deixa do seu jeitinho ✨
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[var(--accent)]" />
            Tema visual
          </CardTitle>
          <CardDescription>
            Escolha a paleta. Você troca quando quiser pelo menu lateral também.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeSwitcherInline />
        </CardContent>
      </Card>

      <form action={updateProfile}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User2 className="h-5 w-5 text-[var(--primary)]" />
              Sobre você
            </CardTitle>
            <CardDescription>Como te chamamos por aqui</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Nome de exibição</Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={profile?.display_name ?? ""}
                placeholder="Seu nome"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="contact_email">E-mail para avisos</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  defaultValue={profile?.contact_email ?? user.email ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp (com DDI)</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  defaultValue={profile?.whatsapp_number ?? ""}
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
              Esses são os canais sugeridos quando você cria um lembrete.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SettingToggle
              icon={<Volume2 className="h-5 w-5 text-[var(--primary)]" />}
              name="notify_sound"
              label="Tocar som no site"
              description="Sininho fofo quando um lembrete dispara"
              defaultChecked={profile?.notify_sound ?? true}
            />

            <SettingToggle
              icon="✉️"
              name="notify_email"
              label="Avisar por e-mail"
              description="Por padrão receber também por e-mail"
              defaultChecked={profile?.notify_email ?? false}
              badge="em breve"
            />

            <SettingToggle
              icon="💬"
              name="notify_whatsapp"
              label="Avisar por WhatsApp"
              description="Aviso direto no seu Zap"
              defaultChecked={profile?.notify_whatsapp ?? false}
              badge="em breve"
            />

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit">Salvar preferências 💾</Button>
              <TestSoundButton />
            </div>
            <p className="text-xs text-[var(--muted-fg)] pt-2">
              💡 Os envios reais por e-mail e WhatsApp ainda estão sendo
              ligados. A UI já está pronta — só falta plugar Resend / Twilio.
            </p>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-[var(--muted-fg)]" />
            Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-[var(--muted-fg)]">Email:</span>{" "}
            <strong>{user.email}</strong>
          </p>
          <p>
            <span className="text-[var(--muted-fg)]">ID:</span>{" "}
            <code className="text-xs">{user.id}</code>
          </p>
        </CardContent>
      </Card>
    </div>
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
