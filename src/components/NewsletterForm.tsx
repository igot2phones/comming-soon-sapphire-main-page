import { useEffect, useRef, useState } from "react";

const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
};

declare global {
  interface Window {
    turnstile?: {
      render: (element: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      if (window.turnstile) resolve();
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const tokenRef = useRef<string>("");
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return; // Local dev without Turnstile configured.
    let cancelled = false;
    loadTurnstileScript()
      .then(() => {
        if (cancelled || !widgetContainerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          size: "flexible",
          callback: (token: string) => {
            tokenRef.current = token;
          },
          "expired-callback": () => {
            tokenRef.current = "";
          },
          "error-callback": () => {
            tokenRef.current = "";
          },
        });
      })
      .catch(() => {
        // Non-fatal — submit will surface a generic error if it fails.
      });
    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  const resetWidget = () => {
    tokenRef.current = "";
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (SITE_KEY && !tokenRef.current) {
      setStatus("error");
      setMessage("Please complete the verification challenge.");
      return;
    }

    // Honeypot — never user-visible, expected to stay empty.
    const formEl = e.currentTarget;
    const honeypot = (formEl.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

    setSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          website: honeypot,
          "cf-turnstile-response": tokenRef.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage("You're on the list. We'll be in touch.");
        setEmail("");
        resetWidget();
      } else {
        const errMap: Record<string, string> = {
          invalid_email: "Please enter a valid email address.",
          captcha_required: "Please complete the verification challenge.",
          captcha_failed: "Verification failed. Please try again.",
          rate_limited: "Too many attempts. Please try again later.",
          payload_too_large: "Submission was too large.",
        };
        setStatus("error");
        setMessage((data.error && errMap[data.error]) || "Something went wrong. Please try again.");
        resetWidget();
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
      resetWidget();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative flex w-full max-w-md flex-col gap-3" noValidate>
      <div className="relative flex flex-col gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-xl sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setStatus("idle");
          }}
          placeholder="Enter your email to get notified"
          className="flex-1 bg-transparent px-5 py-3 text-sm font-light text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          aria-label="Email address"
          autoComplete="email"
          required
          disabled={submitting}
        />
        {/* Honeypot — visually hidden, off-screen, and excluded from tab order.
            Real users never see or fill it; many bots will. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-white px-6 py-3 text-sm font-light text-black transition hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Notify Me"}
        </button>
      </div>

      {SITE_KEY && (
        <div
          ref={widgetContainerRef}
          className="flex justify-center"
          aria-label="Verification challenge"
        />
      )}

      {status !== "idle" && (
        <p
          role="status"
          className={`text-xs ${status === "success" ? "text-sapphire-glow" : "text-destructive"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
