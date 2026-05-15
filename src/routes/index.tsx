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
              aria-label="Scroll to learn more"
              className="group inline-flex items-center gap-5 text-left"
            >
              <span className="text-[10px] uppercase tracking-[0.55em] text-muted-foreground/70 group-hover:text-foreground transition-colors duration-500">
                Scroll
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

      {/* NEWSLETTER */}
      <section
        id="newsletter"
        className="snap-section relative z-10 w-full min-h-screen px-6 sm:px-10 lg:px-16 py-32 flex flex-col items-center justify-center text-center"
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.22_255/0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative max-w-2xl">
          <p className="animate-fade-in text-[10px] sm:text-xs uppercase tracking-[0.5em] text-muted-foreground/70">
            Stay in the loop
          </p>
          <h2 className="animate-fade-up delay-200 mt-6 text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground/95">
            Be the first to know.
          </h2>
          <p className="animate-fade-up delay-300 mt-6 text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            Join the waitlist and we'll let you know the moment Sapphire Servers goes live.
          </p>

          <div className="mt-12 animate-fade-up delay-500 w-full flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-10 text-center text-[11px] sm:text-xs text-muted-foreground/60 font-light tracking-wide">
        Sapphire Servers — Rewriting everything to bring you more power, more features, and more control.
      </footer>
    </main>
  );
}
