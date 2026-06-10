import { useEffect, useRef } from "react";

type Star = {
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  r: number; // radius px
  depth: number; // parallax depth 0..1 (further = smaller = slower)
  phase: number; // twinkle phase offset
  speed: number; // twinkle speed
};

/**
 * Fixed full-viewport starfield: tiny twinkling dots on three parallax
 * depths, drawn on a lightweight canvas. Client-only (everything happens in
 * useEffect), respects prefers-reduced-motion (renders a static field with
 * no animation loop) and lowers star counts on small screens.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    const seed = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = Math.round((width * height) / (width < 768 ? 22000 : 11000));
      const count = Math.max(30, Math.min(base, 180));
      stars = Array.from({ length: count }, () => {
        const depth = [0.25, 0.55, 1][Math.floor(Math.random() * 3)];
        return {
          x: Math.random(),
          y: Math.random(),
          r: 0.4 + depth * (0.5 + Math.random() * 0.7),
          depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.9,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const scroll = window.scrollY || 0;
      for (const s of stars) {
        // Parallax: deeper stars scroll slower than the page.
        const py = (s.y * height - scroll * s.depth * 0.12) % height;
        const y = py < 0 ? py + height : py;
        const tw = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * width, y, s.r, 0, Math.PI * 2);
        const alpha = (0.25 + 0.6 * tw) * (0.35 + 0.65 * s.depth);
        ctx.fillStyle = `rgba(190, 206, 255, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      seed();
      if (reduced) draw(0);
    };

    seed();
    if (reduced) {
      draw(0);
      window.addEventListener("resize", onResize, { passive: true });
      return () => window.removeEventListener("resize", onResize);
    }

    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 h-full w-full pointer-events-none opacity-70"
    />
  );
}
