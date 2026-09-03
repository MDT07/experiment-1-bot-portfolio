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

The first measured baseline uses Kimi K2.7 Code through the exact OpenClaw ref
`kimi/kimi-for-coding`. Its initial release is owner-only, capped at one
blueprint request, and keeps preview chat disabled. No model provider key or
OpenClaw operator credential belongs in this Vercel project.

## Architecture

```text
Browser
  ├─ Supabase Auth → GitHub OAuth / email magic link
  └─ Vercel /api/labs/*
       ├─ schema validation + same-origin gate
       ├─ Supabase RLS + atomic one-shot/message quota
       └─ authenticated Studio Bridge → private OpenClaw Gateway
                                      → selected Kimi Code model

Owner browser
  └─ Vercel /ops → exact owner identity + read-only telemetry

Private owner runtime
  ├─ narrow HTTPS Studio Bridge → text-only validated requests
  └─ private OpenClaw Gateway → isolated Studio agent → Kimi Code
```

Vercel cannot host the always-on OpenClaw Gateway. The hardened deployment kit
is in `infra/openclaw`; it keeps the raw Gateway private, exposes only a narrow
text-only Bridge through a separately authenticated ingress, and keeps all
channels and powerful tools disabled. The Gateway token and `KIMI_API_KEY` stay
on the persistent host. Vercel receives only the separate Bridge token.

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
2. Verify the selected `kimi/kimi-for-coding` model is visible to the account;
   do not infer availability from the key format alone.
3. Bootstrap the persistent OpenClaw host from `infra/openclaw`, then expose
   only the Bridge port through authenticated HTTPS ingress.
4. Add the Bridge URL/token and model label to Vercel without committing an
   `.env` file. Keep `AI_DEMO_PUBLIC=false` during setup.
5. Verify sign-in, one successful guest build, blocked second build, five chat
   messages, owner bypass, `/ops` denial for non-owners, and logout.
6. Protect `/api/labs/*` with a platform rate-limit rule.
7. For the first measurement set `AI_DEMO_PUBLIC=true`,
   `AI_DEMO_OWNER_ONLY=true`, `AI_DEMO_RUN_LIMIT=1`, and
   `AI_DEMO_CHAT_ENABLED=false`; redeploy and run one production blueprint.

## Media provenance and quality

The nine visual chapters use original animated references from the user-curated
MDT07 Reference Studio board “Web references #1 AI bots”. They are shown as
visual research, not claimed as client work or original authorship. Original GIF
copies live in `public/media/original`; reduced-motion visitors receive static
first frames.
