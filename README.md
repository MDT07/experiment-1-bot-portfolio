# Emir Semenov — Bot Systems Portfolio

An experimental bilingual portfolio for AI-powered bot systems across Telegram,
Instagram, WhatsApp, and connected service channels.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3100`. The Russian version is available at `/ru`.

## Production

Deploy this directory as an independent Vercel project and set
`NEXT_PUBLIC_SITE_URL` to the final canonical URL.

The public portfolio remains a media-led showcase. `/labs` and `/ru/labs` add a
bounded systems-architecture demo backed by a server-side NVIDIA NIM endpoint.
The endpoint never exposes the provider credential and never executes external
tools or write actions.

The unlinked `/ops` route is an owner-only operations surface protected by HTTP
authentication and `noindex` headers. It is not an OpenClaw Gateway: the actual
Gateway must use a separate persistent runtime and an isolated OpenClaw profile.

Required server-only environment variables are documented in `.env.example`.
Keep `AI_DEMO_PUBLIC=false` until a production rate-limit rule is active.

## AI lab architecture

```text
Public browser
    ↓
Vercel /api/labs/architect
    ↓ validation + same-origin check + bounded rate window
NVIDIA hosted NIM

Owner browser
    ↓ HTTP auth
Vercel /ops
    ↓ status only
Isolated OpenClaw persistent host (Tailscale Serve or Cloudflare Access)
```

The initial lab supports three honest concept modes: channel bot, agent
assistant, and visual-reference operator. Generated output includes the user
journey, bounded agent loop, proposed tools and permissions, guardrails, demo
script, and an evaluation contract.

## Nine-scene direction

The experience is composed as nine full-screen signals. Each chapter is driven
by one animated reference from the user-curated source board. Exact original
GIF copies live in `public/media/original`; the earlier local MP4 sources remain
intact in `experiments/gif`.

- `animation8.gif` opens the full-frame hero.
- `animation5.gif` and `animation6.gif` become moving background chapters.
- The remaining six animations are staged as asymmetric objects, portraits,
  operational layers, and the final contact signal.

The animations are visual research from the user-curated MDT07 Reference
Studio Board “Web references #1 AI bots”. They are not presented as portfolio
authorship or client work.

## Media quality

The experience uses the original animated GIF files from the source board.
They are not enlarged, sharpened, frame-interpolated, or transcoded again, so
the original palette, timing, and loop behavior stay intact. Off-screen scenes
use native browser lazy loading. If the visitor prefers reduced motion, the
browser selects a static first-frame PNG instead.
