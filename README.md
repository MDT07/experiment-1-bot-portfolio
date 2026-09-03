# Emir Semenov — Bot & Agent Systems

A bilingual experimental portfolio and static catalog of prepared bot, assistant,
and automation architectures for Telegram, Instagram, WhatsApp, Discord, web,
and connected business services.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3100`. The English systems catalog is available at
`/labs`; the Russian version is at `/ru/labs`.

## Systems catalog

The public catalog contains eight implementation blueprints:

1. Lead qualification concierge
2. Grounded support desk
3. Social commerce guide
4. Booking and schedule coordinator
5. Private knowledge operator
6. Document intake and onboarding
7. Community and content operator
8. Executive analytics copilot

Each blueprint documents the business audience, intended outcome, conversation
or operating route, functional scope, application/data/operations stack,
integration surface, production controls, and concrete delivery package.

Model providers are presented only as optional architecture choices. The public
site performs no model calls, stores no prompts, offers no sign-in, and contains
no provider, OpenClaw, Supabase, or channel credentials. A real client build
would select a model only after evaluation against task quality, latency, cost,
privacy, and regional availability.

Model names shown in the catalog were checked on 3 September 2026 against the
official [OpenAI](https://developers.openai.com/api/docs/models),
[Anthropic](https://platform.claude.com/docs/en/models/overview),
[Google Gemini](https://ai.google.dev/gemini-api/docs/models), and
[Mistral AI](https://docs.mistral.ai/models) catalogs. They are dated references,
not promises of future availability.

## Architecture

```text
Next.js portfolio
  ├─ nine-scene cinematic showcase
  ├─ client-side solution filters
  ├─ eight static architecture blueprints
  ├─ public Privacy Policy and Terms
  └─ no auth, database, AI runtime, or external write actions
```

The app intentionally uses React state only for temporary catalog selection and
filtering. No selection is written to local storage or transmitted to a project
database.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The catalog tests verify unique IDs/codes, localized coverage, deterministic or
optional model paths, production controls, delivery scope, and provider variety.

## Deployment

Set only the canonical public URL:

```text
NEXT_PUBLIC_SITE_URL=https://experiment-1-bot-portfolio.vercel.app
```

No AI or database environment variables are required. Vercel remains the public
host; the repository is the source of truth.

## Media provenance and quality

The nine visual chapters use original animated references from the user-curated
MDT07 Reference Studio board “Web references #1 AI bots”. They are shown as
visual research, not claimed as client work or original authorship. Original GIF
copies live in `public/media/original`; reduced-motion visitors receive static
first frames.

## Historical runtime notes

`docs/KIMI-LIVE-TEST-2026-09-03.md` and
`docs/OPENCLAW-MODEL-DECISION.md` record an earlier isolated runtime experiment.
They are retained as engineering history and do not describe the current public
application.
