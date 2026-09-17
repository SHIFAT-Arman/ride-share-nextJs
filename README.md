# Ride Share Frontend

Next.js 16 App Router portal + marketing site. Package manager: **Bun**.

## Setup

```bash
bun install
cp .env.example .env
bun dev
```

Dev server defaults to [http://localhost:3000](http://localhost:3000). Prefer port **3001** if the Nest API also uses 3000:

```bash
bun dev -- -p 3001
```

## Environment

See [`.env.example`](.env.example). Important vars:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Browser axios base (local Nest URL, or `/v1/api` when proxying) |
| `API_URL` | Server/RSC axios base (absolute URL to Nest) |
| `API_PROXY_TARGET` | Optional. When set, Next rewrites `/v1/api/*` to that origin (same-origin cookies on Vercel) |
| `NEXT_PUBLIC_PUSHER_KEY` / `CLUSTER` | Realtime announcements |

### Local Nest (default)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/v1/api
API_URL=http://localhost:3000/v1/api
# API_PROXY_TARGET unset
```

### Proxy to Render from local or Vercel

```env
NEXT_PUBLIC_API_URL=/v1/api
API_URL=https://ride-share-nestjs.onrender.com/v1/api
API_PROXY_TARGET=https://ride-share-nestjs.onrender.com
```

Restart `bun dev` after changing env. No code changes needed to switch backends.

## Why the API rewrite?

The Render API currently allows CORS only for `http://localhost:3001` and sets cookies with `SameSite=Lax`. A Vercel origin calling Render directly would fail login/cookies. Rewriting `/v1/api` through Next keeps the browser same-origin so Lax cookies work.

If you later drop the rewrite and call Render from the browser, update the Nest service on Render:

- `FRONTEND_URL` = your Vercel origin(s)
- `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=none`, `TRUST_PROXY=true`

## Auth notes

- Session cookies: `rs_access`, `rs_refresh` (HttpOnly).
- `/portal/*` requires a cookie via `proxy.ts`.
- Role mismatch (e.g. rider opening `/portal/admin`) redirects to that role’s dashboard after `/auth/me`.
- Pusher announcement channels are public (`{role}-notifications`); private channels need a backend auth endpoint.

## Scripts

```bash
bun run build
bun start
bunx playwright test
```

## Deploy on Vercel

Import the GitHub repo in the Vercel dashboard (this app uses Bun via `bun.lock` + [`vercel.json`](vercel.json)).

**Environment variables (Production):**

```
NEXT_PUBLIC_API_URL=/v1/api
API_URL=https://ride-share-nestjs.onrender.com/v1/api
API_PROXY_TARGET=https://ride-share-nestjs.onrender.com
NEXT_PUBLIC_PUSHER_KEY=<your key>
NEXT_PUBLIC_PUSHER_CLUSTER=<your cluster>
```

After the first deploy, smoke-test `/`, `/login`, then login → portal (cookies go through the `/v1/api` rewrite).
