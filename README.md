# Diarinho 🌸

Site fofo de **diário + agenda** com lembretes configuráveis e autenticação,
construído com Next.js 15, Tailwind CSS 4 e Supabase.

## ✨ O que tem

- Login/cadastro com Supabase Auth (e-mail + senha)
- Diário com humor, tags e título por entrada
- Agenda com calendário mensal, próximos compromissos e histórico
- Lembretes por evento — você decide quando ser avisado:
  - `X minutos antes` (precisão temporal exata)
  - `X horas antes` (precisão temporal exata)
  - `X dias antes` — usa **calendário**: ativa assim que entra na data
    correspondente, independente do horário marcado.
- Canais por lembrete: ✨ destaque no site, 🔔 som no site, ✉️ e-mail, 💬 WhatsApp
  - Som no site e destaque visual: **funcionando**
  - E-mail e WhatsApp: UI pronta + persistência da preferência (envio real
    fica como TODO — só plugar Resend / Twilio nas Edge Functions)
- 4 temas: 🌸 rosa pastel (padrão), 🌿 menta, 🌙 neon noturno, 🌃 dark
  aconchego — troca em qualquer hora pela barra lateral.

## 🛠️ Setup

Requisitos: Node 20+, Docker, Supabase CLI.

```bash
# 1. Instalar deps
npm install

# 2. Subir Supabase local (Postgres + Auth + Studio)
npx supabase start
# anota os valores que aparecem (API URL e ANON KEY)

# 3. Aplicar migrations
npx supabase db reset

# 4. Configurar variáveis
cp .env.example .env.local
# preenche NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY com
# os valores do passo 2.

# 5. Subir o app
npm run dev
```

Acesse http://localhost:3000

Studio do Supabase: http://127.0.0.1:54323
Inbucket (e-mails fake do auth local): http://127.0.0.1:54324

## 📁 Estrutura

```
src/
  app/
    (app)/               # rotas protegidas (com sidebar)
      page.tsx           # dashboard
      diario/
      agenda/
      configuracoes/
    login/, signup/      # rotas públicas
    auth/                # callback + signout
  components/
    ui/                  # primitivos shadcn-style
    diary/               # editor + cards do diário
    agenda/              # form de evento + calendário + cards
    theme-*.tsx          # sistema de temas
    reminder-engine.tsx  # poller que dispara lembretes
    sidebar.tsx
  lib/
    supabase/            # clients (browser, server, middleware)
    reminders.ts         # regras de "lembrete ativo" (dias = calendário)
    sound.ts             # Web Audio para o sininho
    database.types.ts    # tipos da DB
supabase/
  config.toml
  migrations/            # SQL das tabelas + RLS
```

## 🔐 Banco

- `profiles` (1×1 com `auth.users`) — preferências de tema e notificação
- `diary_entries` — anotações com humor, título, conteúdo, tags
- `events` — compromissos com data, cor, local
- `event_reminders` — N por evento, com `unit`/`value`/`channels[]`

Tudo com Row-Level Security: cada usuário só vê o que é seu.

## 🔮 Próximos passos (TODO)

- Plug das notificações reais por e-mail (Resend) e WhatsApp (Twilio /
  Meta Cloud API) — basta criar uma Edge Function rodando em cron de
  1 minuto que lê `event_reminders` ativos e dispara o canal configurado
  (a lógica de "está ativo agora?" já está em `src/lib/reminders.ts` e
  pode ser reaproveitada).
- Push notifications no navegador (Service Worker)
- Compartilhamento de entradas selecionadas
- Recorrência de eventos (RRULE)
