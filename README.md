# Emir Semenov — Bot Systems Portfolio

A bilingual experimental portfolio and bounded Bot Studio for designing bot
systems across web, Telegram, Instagram, WhatsApp, and concept-only channels.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3100`. English Bot Studio lives at `/labs`; Russian at
`/ru/labs`.

## Bot Studio contract

A signed-in visitor describes one job, behavior, allowed knowledge, and
operating boundaries. The server returns a validated `BotBlueprint` with a
preview chat and a connected capability/knowledge graph.

- GitHub OAuth or email magic link establishes one Supabase identity.
- A non-owner identity receives exactly one successful generation.
- Provider/storage failures release the reservation and do not consume it.
- A guest project receives five atomic preview-message claims.
- The owner email receives unlimited builds and preview messages.
- No preview executes channel actions, tools, webhooks, or external writes.
- Supabase RLS isolates every guest project, message, entitlement, and run.

The public inference provider is NVIDIA NIM and its key is server-only. The
separate owner OpenClaw runtime uses Kimi Code. The two trust zones are not
interchangeable.

## Architecture

```text
Browser
  ├─ Supabase Auth → GitHub OAuth / email magic link
  └─ Vercel /api/labs/*
       ├─ schema validation + same-origin gate
       ├─ Supabase RLS + atomic one-shot/message quota
       └─ NVIDIA NIM → validated BotBlueprint / bounded answer

Owner browser
  └─ Vercel /ops → exact owner identity + read-only telemetry

Private owner runtime
  └─ persistent OpenClaw host → isolated profile → Kimi Code
```

Vercel cannot host the always-on OpenClaw Gateway. The hardened deployment kit
is in `infra/openclaw`; it binds the Gateway to host loopback and keeps all
channels and powerful tools disabled by default.

## Supabase setup

This project accepts only modern Supabase keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (`sb_publishable_…`)
- `SUPABASE_SECRET_KEY` (`sb_secret_…`, server-only)
- `STUDIO_OWNER_USER_ID` (immutable Supabase Auth UUID)
- `STUDIO_OWNER_EMAIL`

Apply `supabase/migrations/202609020001_bot_studio.sql`, then configure these
Auth redirect URLs exactly:

```text
http://localhost:3100/auth/callback
https://experiment-1-bot-portfolio.vercel.app/auth/callback
```

Enable GitHub OAuth only after its client ID/secret is stored in Supabase. Email
magic-link auth works as the lower-setup identity path. Never put the secret key
in a `NEXT_PUBLIC_` variable.

## Deployment gate

1. Apply the database migration and run the SQL policy tests.
2. Add Vercel environment variables from `.env.example` without committing an
   `.env` file.
3. Keep `AI_DEMO_PUBLIC=false` during setup.
4. Verify sign-in, one successful guest build, blocked second build, five chat
   messages, owner bypass, `/ops` denial for non-owners, and logout.
5. Protect `/api/labs/*` with a platform rate-limit rule.
6. Set `AI_DEMO_PUBLIC=true`, redeploy, and repeat the production smoke test.

## Media provenance and quality

The nine visual chapters use original animated references from the user-curated
MDT07 Reference Studio board “Web references #1 AI bots”. They are shown as
visual research, not claimed as client work or original authorship. Original GIF
copies live in `public/media/original`; reduced-motion visitors receive static
first frames.
