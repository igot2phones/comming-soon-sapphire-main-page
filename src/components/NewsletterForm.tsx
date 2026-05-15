import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("success");
    setMessage("You're on the list. We'll be in touch.");
    setEmail("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative rounded-full p-1.5 flex flex-col sm:flex-row gap-2 w-full max-w-md border border-white/10 bg-white/[0.03] backdrop-blur-xl"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        placeholder="Enter your email to get notified"
        className="flex-1 bg-transparent px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-light"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="rounded-full px-6 py-3 text-sm font-light bg-white text-black transition hover:bg-white/90 active:scale-[0.98]"
      >
        Notify Me
      </button>
      {status !== "idle" && (
        <p
          role="status"
          className={`sm:absolute sm:-bottom-7 sm:left-2 text-xs mt-1 sm:mt-0 ${
            status === "success" ? "text-sapphire-glow" : "text-destructive"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
