/**
 * POST /api/subscribe handler.
 *
 * Security model
 * --------------
 * This endpoint is write-only. There is no `GET` route, no list endpoint,
 * and no code path anywhere in the application that returns stored emails
 * to a client. Subscriber data is read exclusively via `wrangler d1
 * execute --remote` from an authenticated Cloudflare account.
 *
 * Abuse mitigations applied here:
 *  - Cloudflare Turnstile token verified server-side.
 *  - Per-IP rate limit in KV (5 requests / hour).
 *  - Strict CORS allow-list driven by ALLOWED_ORIGIN.
 *  - Honeypot field.
 *  - Hard cap on request body size.
 *  - Server-side email validation + normalisation.
 *  - Dedupe via PRIMARY KEY (INSERT OR IGNORE) — no enumeration leak.
 */

// Minimal local types so we don't depend on @cloudflare/workers-types.
interface D1Result {
  success: boolean;
}
interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  run: () => Promise<D1Result>;
}
interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
}
interface KVNamespace {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
}

export interface SubscribeEnv {
  DB?: D1Database;
  RATELIMIT?: KVNamespace;
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGIN?: string;
}

const MAX_BODY_BYTES = 2048;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let isSubscribersSchemaReady = false;

function json(body: Record<string, unknown>, status: number, corsOrigin: string | null): Response {
  const headers: Record<string, string> = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  };
  if (corsOrigin) {
    headers["access-control-allow-origin"] = corsOrigin;
    headers["vary"] = "Origin";
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function resolveAllowedOrigin(
  requestOrigin: string | null,
  allowed: string | undefined,
): string | null {
  if (!requestOrigin) return null;
  if (!allowed) return null;
  const list = allowed
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.includes(requestOrigin) ? requestOrigin : null;
}

function getClientIp(request: Request): string {
  // Cloudflare always sets CF-Connecting-IP for inbound requests.
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  try {
    const form = new FormData();
    form.append("secret", secret);
    form.append("response", token);
    if (ip && ip !== "unknown") form.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function checkRateLimit(kv: KVNamespace, ip: string): Promise<boolean> {
  // If we cannot identify the caller, bucket them all together under a
  // single shared key so missing-IP doesn't become a way to bypass limits.
  const key = `rl:${ip === "unknown" ? "_unknown" : ip}`;
  const current = await kv.get(key);
  const count = current ? Number.parseInt(current, 10) || 0 : 0;
  if (count >= RATE_LIMIT_MAX) return false;
  await kv.put(key, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });
  return true;
}

async function ensureSubscribersSchema(db: D1Database): Promise<void> {
  if (isSubscribersSchemaReady) return;
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS subscribers (email TEXT PRIMARY KEY, created_at INTEGER NOT NULL)",
    )
    .run();
  await db
    .prepare("CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at)")
    .run();
  isSubscribersSchemaReady = true;
}

export async function handleSubscribe(request: Request, env: SubscribeEnv): Promise<Response> {
  const requestOrigin = request.headers.get("origin");
  const corsOrigin = resolveAllowedOrigin(requestOrigin, env.ALLOWED_ORIGIN);

  // CORS preflight.
  if (request.method === "OPTIONS") {
    if (!corsOrigin) return new Response(null, { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": corsOrigin,
        "access-control-allow-methods": "POST, OPTIONS",
        "access-control-allow-headers": "content-type",
        "access-control-max-age": "86400",
        vary: "Origin",
      },
    });
  }

  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405, corsOrigin);
  }

  // If an Origin header is present, it MUST be in the allow-list.
  // Same-origin POSTs from typical browsers also send Origin, so this is safe.
  if (requestOrigin && !corsOrigin) {
    return json({ ok: false, error: "forbidden" }, 403, null);
  }

  if (!env.DB) {
    return json({ ok: false, error: "server_misconfigured" }, 500, corsOrigin);
  }

  // Body size cap.
  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "payload_too_large" }, 413, corsOrigin);
  }

  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: "payload_too_large" }, 413, corsOrigin);
    }
    payload = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400, corsOrigin);
  }

  if (!payload || typeof payload !== "object") {
    return json({ ok: false, error: "invalid_payload" }, 400, corsOrigin);
  }
  const body = payload as Record<string, unknown>;

  // Honeypot: silently accept-and-discard. Don't tell the bot it failed.
  const honeypot = typeof body.website === "string" ? body.website : "";
  if (honeypot.length > 0) {
    return json({ ok: true }, 200, corsOrigin);
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  const email = rawEmail.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400, corsOrigin);
  }

  const ip = getClientIp(request);

  // Rate limit (best effort — only enforced if KV is bound).
  if (env.RATELIMIT) {
    const allowed = await checkRateLimit(env.RATELIMIT, ip);
    if (!allowed) {
      return json({ ok: false, error: "rate_limited" }, 429, corsOrigin);
    }
  }

  // Turnstile verification. Required in production; skipped only if the
  // secret is unset (local dev convenience).
  if (env.TURNSTILE_SECRET_KEY) {
    const token =
      typeof body["cf-turnstile-response"] === "string"
        ? (body["cf-turnstile-response"] as string)
        : "";
    if (!token) {
      return json({ ok: false, error: "captcha_required" }, 400, corsOrigin);
    }
    const ok = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip);
    if (!ok) {
      return json({ ok: false, error: "captcha_failed" }, 400, corsOrigin);
    }
  }

  // INSERT OR IGNORE: duplicates succeed silently. This prevents an attacker
  // from learning whether a given address is already subscribed.
  try {
    await ensureSubscribersSchema(env.DB);
    await env.DB.prepare("INSERT OR IGNORE INTO subscribers (email, created_at) VALUES (?, ?)")
      .bind(email, Math.floor(Date.now() / 1000))
      .run();
  } catch (err) {
    console.error("subscribe insert failed", err);
    return json({ ok: false, error: "server_error" }, 500, corsOrigin);
  }

  return json({ ok: true }, 200, corsOrigin);
}
