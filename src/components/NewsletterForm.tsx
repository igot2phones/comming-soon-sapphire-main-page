import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      } else {
        const errMap: Record<string, string> = {
          invalid_email: "Please enter a valid email address.",
          rate_limited: "Too many attempts. Please try again later.",
          payload_too_large: "Submission was too large.",
          forbidden: "This domain is not allowed to submit newsletter signups.",
          server_misconfigured: "Newsletter storage is not configured yet.",
          server_error: "Newsletter storage failed. Please try again later.",
        };
        setStatus("error");
        setMessage((data.error && errMap[data.error]) || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
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
