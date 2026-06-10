import { useEffect, useRef, useState } from "react";

const RECAPTCHA_SCRIPT_SRC = "https://www.google.com/recaptcha/api.js?render=explicit";

type RecaptchaOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark";
  size?: "normal" | "compact" | "invisible";
};

declare global {
  interface Window {
    grecaptcha?: {
      render: (element: string | HTMLElement, options: RecaptchaOptions) => number;
      reset: (widgetId?: number) => void;
      ready?: (cb: () => void) => void;
    };
  }
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

function loadRecaptchaScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
    return Promise.resolve();
  }
  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${RECAPTCHA_SCRIPT_SRC}"]`,
  );
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      if (window.grecaptcha && typeof window.grecaptcha.render === "function") resolve();
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RECAPTCHA_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load reCAPTCHA"));
    document.head.appendChild(script);
  });
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [widgetFailed, setWidgetFailed] = useState(false);
  const tokenRef = useRef<string>("");
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return; // Local dev without reCAPTCHA configured.
    let cancelled = false;
    loadRecaptchaScript()
      .then(() => {
        if (cancelled || !widgetContainerRef.current || !window.grecaptcha) {
          if (!cancelled && !window.grecaptcha) setWidgetFailed(true);
          return;
        }
        const doRender = () => {
          if (cancelled || !widgetContainerRef.current || !window.grecaptcha) return;
          try {
            widgetIdRef.current = window.grecaptcha.render(widgetContainerRef.current, {
              sitekey: SITE_KEY,
              theme: "dark",
              size: "normal",
              callback: (token: string) => {
                tokenRef.current = token;
              },
              "expired-callback": () => {
                tokenRef.current = "";
              },
              "error-callback": () => {
                tokenRef.current = "";
                setWidgetFailed(true);
              },
            });
          } catch {
            setWidgetFailed(true);
          }
        };
        if (typeof window.grecaptcha.ready === "function") {
          window.grecaptcha.ready(doRender);
        } else {
          doRender();
        }
      })
      .catch(() => {
        if (!cancelled) setWidgetFailed(true);
      });
    return () => {
      cancelled = true;
      // reCAPTCHA has no "remove" API; reset clears any pending token.
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  const resetWidget = () => {
    tokenRef.current = "";
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try {
        window.grecaptcha.reset(widgetIdRef.current);
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
      setMessage(
        widgetFailed
          ? "Verification couldn't load. Please disable any ad/script blocker for this site and refresh."
          : "Please complete the verification challenge.",
      );
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
          "g-recaptcha-response": tokenRef.current,
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
          captcha_required: SITE_KEY
            ? "Please complete the verification challenge."
            : "Verification is currently unavailable. Please try again later.",
          captcha_failed: "Verification failed. Please try again.",
          rate_limited: "Too many attempts. Please try again later.",
          payload_too_large: "Submission was too large.",
          forbidden: "This domain is not allowed to submit newsletter signups.",
          server_misconfigured: "Newsletter storage is not configured yet.",
          server_error: "Newsletter storage failed. Please try again later.",
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
          className="sheen rounded-full bg-white px-6 py-3 text-sm font-light text-black transition duration-300 hover:bg-white/90 hover:shadow-[0_0_24px_oklch(0.75_0.18_250/0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Notify Me"}
        </button>
      </div>

      {SITE_KEY && (
        <div
          ref={widgetContainerRef}
          className="flex min-h-[78px] justify-center"
          aria-label="Verification challenge"
        />
      )}

      {SITE_KEY && widgetFailed && status === "idle" && (
        <p role="status" className="text-xs text-destructive">
          Verification couldn&apos;t load. Please disable any ad/script blocker for this site and
          refresh.
        </p>
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
