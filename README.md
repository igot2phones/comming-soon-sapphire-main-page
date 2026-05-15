# comming-soon-sapphire-main-page

Coming-soon landing page for Sapphire Servers, deployed to **Cloudflare**
(Workers + Pages, free tier). The site has a single user-facing feature:
a newsletter signup form.

## Security model for the newsletter

There is **no admin login** on the site, by design. Brute-forcing a login is
the most common way email lists leak — so the simplest defence is to not
have one.

```
Visitor ─POST /api/subscribe─▶ Cloudflare Worker ─INSERT─▶ Cloudflare D1
                                                              ▲
                                                              │ read-only via
                                                              │ wrangler CLI,
                                                              │ authed by YOUR
                                                              │ Cloudflare account
```

Properties:

- The website is **write-only**. There is no `GET` endpoint, no list view,
  and no code path in this repo that returns stored subscriber emails to a
  browser. Reading the entire site source tells an attacker nothing about
  who has subscribed.
- Subscriber data is **retrieved exclusively via `wrangler`** authenticated
  against your Cloudflare account.
- Abuse mitigations on `POST /api/subscribe`:
  - Cloudflare **Turnstile** (server-verified)
  - Per-IP **rate limit** (5/hour) via Cloudflare KV
  - Strict **CORS** allow-list (`ALLOWED_ORIGIN`)
  - **Honeypot** field + payload size cap
  - Server-side email validation + dedupe via `INSERT OR IGNORE` (no
    enumeration leak)

## One-time setup

You need a free Cloudflare account.

```bash
# 1. Install deps and the Wrangler CLI
bun install   # or: npm install
bunx wrangler login

# 2. Create the D1 database and paste the returned `database_id`
#    into wrangler.jsonc (replaces REPLACE_WITH_D1_DATABASE_ID).
bunx wrangler d1 create igot2phones-newsletter

# 3. Create the KV namespace for rate limiting and paste the returned `id`
#    into wrangler.jsonc (replaces REPLACE_WITH_KV_NAMESPACE_ID).
bunx wrangler kv namespace create RATELIMIT

# 4. Apply the schema to the remote D1 database
bunx wrangler d1 migrations apply igot2phones-newsletter --remote

# 5. Get a Turnstile site/secret key pair (free):
#      https://dash.cloudflare.com/?to=/:account/turnstile
#    - VITE_TURNSTILE_SITE_KEY is public (build-time, exposed in JS).
#    - TURNSTILE_SECRET_KEY is private (server-side only).

# 6. Set production secrets on the Worker
bunx wrangler secret put TURNSTILE_SECRET_KEY
```

In the Cloudflare Pages project settings, set:

- **Build env var** `VITE_TURNSTILE_SITE_KEY` — your Turnstile site key.
- **Runtime var** `ALLOWED_ORIGIN` — comma-separated list of origins that
  may call `/api/subscribe`, e.g. `https://sapphireservers.pages.dev`.

## Local development

```bash
cp .dev.vars.example .dev.vars         # fill in secrets for `wrangler dev`
cp .env.example .env                   # fill in VITE_TURNSTILE_SITE_KEY
bun run dev                            # or: npm run dev
```

If `TURNSTILE_SECRET_KEY` is unset locally, the server skips Turnstile
verification (dev convenience only — production must always set it).

## Deploy

Either push to the connected GitHub branch (Cloudflare Pages auto-deploys),
or run:

```bash
bunx wrangler deploy
```

## Downloading your subscriber list

These commands require `wrangler login` — i.e. an authenticated session on
your Cloudflare account. No public endpoint serves this data.

```bash
# Quick peek
bunx wrangler d1 execute igot2phones-newsletter --remote \
  --command "SELECT email, datetime(created_at,'unixepoch') AS joined FROM subscribers ORDER BY created_at;"

# Full SQL dump (importable, archivable)
bunx wrangler d1 export igot2phones-newsletter --remote --output emails.sql

# CSV export
bunx wrangler d1 execute igot2phones-newsletter --remote \
  --command "SELECT email, created_at FROM subscribers ORDER BY created_at;" \
  --json > emails.json
```

## Scripts

| Command          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `bun run dev`    | Vite dev server                          |
| `bun run build`  | Production build                         |
| `bun run lint`   | ESLint                                   |
| `bun run format` | Prettier                                 |

