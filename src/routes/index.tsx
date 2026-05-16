import { createFileRoute } from "@tanstack/react-router";
import { NewsletterForm } from "@/components/NewsletterForm";

export const Route = createFileRoute("/")({
  component: ComingSoon,
  head: () => ({
    meta: [
      { title: "Sapphire Servers — Coming Soon" },
      {
        name: "description",
        content:
          "A new era of hosting is being rewritten from the ground up. Join the Sapphire Servers waitlist.",
      },
    ],
  }),
});

function ComingSoon() {
  const scrollToNewsletter = () => {
    document.getElementById("newsletter")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="relative w-full overflow-x-hidden text-foreground bg-black">
      {/* Global ambient background */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-1/3 -bottom-60 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.22_255/0.18),transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,oklch(0.5_0.2_260/0.15),transparent_70%)] blur-3xl" />
      </div>

      {/* HERO */}
      <section className="snap-section relative z-10 min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-y-16 px-6 sm:px-10 lg:px-20 xl:px-28 py-24">
        {/* Right-side mystical image stack */}
        <div aria-hidden className="hidden lg:block absolute inset-y-0 right-0 w-[62%] pointer-events-none">
          <div className="relative h-full w-full overflow-visible">
            {/* Far drifting layer */}
            <img
              src="/assets/spoiler-3.png"
              alt=""
              className="absolute right-[6%] top-[14%] w-[32rem] opacity-25 blur-[6px] saturate-[0.7] rotate-[-8deg] [mask-image:radial-gradient(ellipse_at_center,#000_12%,rgba(0,0,0,0.52)_42%,transparent_68%)] animate-float"
              style={{ animationDuration: "11s" }}
            />
            {/* Mid haze layer */}
            <img
              src="/assets/spoiler-1.png"
              alt=""
              className="absolute -right-20 bottom-[8%] w-[34rem] opacity-30 blur-[8px] saturate-[0.6] rotate-[6deg] [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)] animate-float"
              style={{ animationDuration: "14s", animationDelay: "-3s" }}
            />
            {/* Hero subject — sharper but still ethereal */}
            <img
              src="/assets/spoiler-2.png"
              alt=""
              className="absolute right-[2%] top-1/2 -translate-y-1/2 w-[88%] max-w-[54rem] opacity-55 blur-[2px] saturate-[0.85] contrast-[1.05] [mask-image:radial-gradient(ellipse_at_center,#000_38%,transparent_82%)] animate-float"
              style={{ animationDuration: "9s", animationDelay: "-1s" }}
            />
            {/* Sapphire bloom */}
            <div className="absolute right-[18%] top-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.62_0.22_255/0.35),transparent_70%)] blur-3xl" />
            <div className="absolute right-[8%] top-[20%] h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.2_250/0.25),transparent_70%)] blur-3xl" />
            {/* Grain / noise via subtle overlay */}
            <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay bg-[radial-gradient(circle_at_30%_40%,#fff,transparent_60%)]" />
            {/* Left fade for legibility */}
            {/* Top/bottom vignette to blend into page */}
          </div>
        </div>

        {/* Mobile: ambient image */}
        <div aria-hidden className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/spoiler-2.png"
            alt=""
            className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[120%] opacity-30 blur-[4px] [mask-image:radial-gradient(ellipse_at_center,#000_10%,rgba(0,0,0,0.5)_40%,transparent_64%)]"
          />
        </div>

        {/* Left content */}
        <div className="relative z-10 col-span-1 lg:col-span-6 xl:col-span-5 max-w-xl">
          <div className="flex items-center gap-3 animate-fade-in">
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-sapphire-glow/60 to-transparent" />
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.55em] text-muted-foreground/80">
              Sapphire Servers
            </p>
          </div>

          <h1 className="mt-10 animate-fade-up delay-200 text-[3.25rem] leading-[0.95] sm:text-7xl md:text-[5.25rem] font-light tracking-[-0.03em] text-foreground/95">
            Coming
            <br />
            <span className="text-sapphire-glow font-extralight italic">soon.</span>
          </h1>

          <p className="mt-10 animate-fade-up delay-300 max-w-sm text-[15px] sm:text-base text-muted-foreground/90 font-light leading-[1.7]">
            A new era of hosting is being rewritten from the ground up — quieter, faster, and built for what comes next.
          </p>

          <div className="mt-14 animate-fade-up delay-500">
            <button
              onClick={scrollToNewsletter}
              aria-label="Sign up for the newsletter"
              className="group inline-flex items-center gap-5 text-left"
            >
              <span className="text-[10px] uppercase tracking-[0.55em] text-muted-foreground/70 group-hover:text-foreground transition-colors duration-500">
                Sign up for the newsletter
              </span>
              <span className="relative h-px w-20 overflow-hidden bg-white/10">
                <span className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-sapphire-glow to-transparent animate-scroll-line" />
              </span>
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:border-sapphire-glow/60 group-hover:bg-sapphire-glow/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5 text-foreground/80 transition-transform duration-500 group-hover:translate-y-0.5 group-hover:text-sapphire-glow"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="m6 13 6 6 6-6" />
                </svg>
                <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.22_250/0.45),transparent_70%)] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT THE REDESIGN */}
      <section className="snap-section relative z-10 w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 items-center gap-y-16 px-6 sm:px-10 lg:px-20 xl:px-28 py-24">
        {/* Left-side mystical image stack */}
        <div aria-hidden className="hidden lg:block absolute inset-y-0 left-0 w-[60%] pointer-events-none">
          <div className="relative h-full w-full overflow-visible">
            <img
              src="/assets/spoiler-1.png"
              alt=""
              className="absolute left-[6%] top-[12%] w-[30rem] opacity-25 blur-[6px] saturate-[0.7] rotate-[6deg] [mask-image:radial-gradient(ellipse_at_center,#000_12%,rgba(0,0,0,0.52)_42%,transparent_68%)] animate-float"
              style={{ animationDuration: "12s" }}
            />
            <img
              src="/assets/spoiler-3.png"
              alt=""
              className="absolute -left-16 bottom-[10%] w-[32rem] opacity-25 blur-[8px] saturate-[0.6] rotate-[-7deg] [mask-image:radial-gradient(ellipse_at_center,#000_10%,rgba(0,0,0,0.5)_38%,transparent_66%)] animate-float"
              style={{ animationDuration: "15s", animationDelay: "-2s" }}
            />
            {/* Hero subject */}
            <img
              src="/assets/spoiler-4.png"
              alt=""
              className="absolute left-[2%] top-1/2 -translate-y-1/2 w-[88%] max-w-[52rem] opacity-60 blur-[2.5px] saturate-[0.9] contrast-[1.04] [mask-image:radial-gradient(ellipse_at_center,#000_28%,rgba(0,0,0,0.82)_52%,transparent_78%)] animate-float"
              style={{ animationDuration: "10s", animationDelay: "-1s" }}
            />
             <div className="absolute left-[12%] -bottom-52 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,oklch(0.62_0.22_255/0.34),transparent_74%)] blur-3xl" />
             <div className="absolute left-[2%] -bottom-36 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.2_250/0.22),transparent_76%)] blur-3xl" />
          </div>
        </div>

        {/* Mobile ambient */}
        <div aria-hidden className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/spoiler-4.png"
            alt=""
            className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[120%] opacity-35 blur-[3px] [mask-image:radial-gradient(ellipse_at_center,#000_24%,rgba(0,0,0,0.78)_50%,transparent_76%)]"
          />
        </div>

        {/* Right content */}
        <div className="relative z-10 col-span-1 lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8 max-w-xl ml-auto">
          <div className="flex items-center gap-3 animate-fade-in">
            <span className="h-px w-10 bg-gradient-to-r from-transparent via-sapphire-glow/60 to-transparent" />
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.55em] text-sapphire-glow/80">
              About the Redesign
            </p>
          </div>

          <h2 className="mt-10 animate-fade-up delay-200 text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.02] font-light tracking-[-0.03em] text-foreground/95">
            Beyond traditional <span className="text-sapphire-glow font-extralight italic">hosting.</span>
          </h2>

          <p className="mt-8 animate-fade-up delay-300 text-[15px] sm:text-base text-muted-foreground/90 font-light leading-[1.7] max-w-md">
            We're developing a from-the-ground-up solution designed to go far beyond traditional game hosting —
            evolving into a powerful, scalable, next-generation platform.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border-y border-white/5">
            {[
              { t: "More Power", d: "Bare-metal performance, tuned for scale." },
              { t: "More Features", d: "A platform built for what comes next." },
              { t: "More Control", d: "Granular tools, transparent by design." },
            ].map((item, i) => (
              <div
                key={item.t}
                className="animate-fade-up bg-black/40 backdrop-blur-xl px-5 py-6"
                style={{ animationDelay: `${0.4 + i * 0.12}s` }}
              >
                <p className="text-[13px] text-sapphire-glow/90 font-light tracking-wide">{item.t}</p>
                <p className="mt-2 text-[12.5px] text-muted-foreground/75 font-light leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER + DISCORD */}
      <section
        id="newsletter"
        className="snap-section relative z-10 w-full min-h-screen px-6 sm:px-10 lg:px-16 py-32 flex flex-col items-center justify-center"
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.22_255/0.2),transparent_70%)] blur-3xl" />
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.2_280/0.18),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative w-full max-w-6xl">
          <div className="text-center">
            <p className="animate-fade-in text-[10px] sm:text-xs uppercase tracking-[0.5em] text-muted-foreground/70">
              Stay in the loop
            </p>
            <h2 className="animate-fade-up delay-200 mt-6 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground/95">
              Be the first to know.
            </h2>
            <p className="animate-fade-up delay-300 mt-6 text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Join the waitlist and we'll let you know the moment Sapphire Servers goes live.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Newsletter card */}
            <div className="animate-fade-up delay-500 group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-10 backdrop-blur-xl transition hover:border-white/20">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-foreground/80"
                  >
                    <path d="M4 6h16v12H4z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                </span>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
                  Newsletter
                </p>
              </div>

              <h3 className="mt-6 text-2xl sm:text-3xl font-light tracking-tight text-foreground/95">
                Get launch updates by <span className="text-sapphire-glow font-extralight italic">email.</span>
              </h3>
              <p className="mt-4 text-sm text-muted-foreground/85 font-light leading-relaxed">
                One quiet email when we go live — no spam, no noise. Just the news you've been waiting for.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <NewsletterForm />
              </div>
            </div>

            {/* Discord card */}
            <div className="animate-fade-up delay-500 group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-[#5865F2]/[0.08] via-white/[0.02] to-sapphire-glow/[0.06] p-8 sm:p-10 backdrop-blur-xl transition hover:border-sapphire-glow/40">
              <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,#5865F2/0.25,transparent_70%)] blur-3xl opacity-60" />

              <div className="relative flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5865F2]/30 bg-[#5865F2]/15">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 text-[#a5acff]"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.075.075 0 0 0-.079.037c-.34.6-.717 1.382-.98 1.999a18.27 18.27 0 0 0-5.487 0 12.65 12.65 0 0 0-.995-2 .078.078 0 0 0-.079-.036A19.736 19.736 0 0 0 5.18 4.369a.07.07 0 0 0-.032.027C1.533 9.79.51 15.063.999 20.27a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.029.078.078 0 0 0 .084-.028 14.21 14.21 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.114 13.114 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.371-.291a.075.075 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.075.075 0 0 1 .078.009c.12.099.245.198.372.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-6.022-.838-11.252-3.549-15.873a.061.061 0 0 0-.031-.028zM8.02 17.1c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.955 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </span>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-muted-foreground/70">
                  Community
                </p>
              </div>

              <h3 className="relative mt-6 text-2xl sm:text-3xl font-light tracking-tight text-foreground/95">
                Join us on <span className="text-[#a5acff] font-extralight italic">Discord.</span>
              </h3>
              <p className="relative mt-4 text-sm text-muted-foreground/85 font-light leading-relaxed">
                Hang out with the team, get behind-the-scenes peeks, and shape Sapphire Servers as we build it.
              </p>

              <ul className="relative mt-6 space-y-2.5 text-sm text-muted-foreground/80 font-light">
                <li className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-[#a5acff]" />
                  Early sneak peeks & announcements
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-[#a5acff]" />
                  Direct chat with the team
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-[#a5acff]" />
                  Share feedback & feature ideas
                </li>
              </ul>

              <div className="relative mt-auto pt-8">
                <a
                  href="https://discord.gg/ZpuHG457RB"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join the Sapphire Servers Discord"
                  className="group/btn inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#5865F2] px-6 py-3.5 text-sm font-medium text-white shadow-[0_8px_30px_-10px_rgba(88,101,242,0.6)] transition hover:bg-[#4752c4] hover:shadow-[0_10px_40px_-8px_rgba(88,101,242,0.7)] active:scale-[0.98] sm:w-auto sm:min-w-[16rem]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.075.075 0 0 0-.079.037c-.34.6-.717 1.382-.98 1.999a18.27 18.27 0 0 0-5.487 0 12.65 12.65 0 0 0-.995-2 .078.078 0 0 0-.079-.036A19.736 19.736 0 0 0 5.18 4.369a.07.07 0 0 0-.032.027C1.533 9.79.51 15.063.999 20.27a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.029.078.078 0 0 0 .084-.028 14.21 14.21 0 0 0 1.226-1.994.076.076 0 0 0-.041-.105 13.114 13.114 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.371-.291a.075.075 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.075.075 0 0 1 .078.009c.12.099.245.198.372.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.106c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-6.022-.838-11.252-3.549-15.873a.061.061 0 0 0-.031-.028zM8.02 17.1c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.955 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.094 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join the Discord
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 -mr-0.5 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-10 text-center text-[11px] sm:text-xs text-muted-foreground/60 font-light tracking-wide">
        Sapphire Servers — Rewriting everything to bring you more power, more features, and more control.
      </footer>
    </main>
  );
}
