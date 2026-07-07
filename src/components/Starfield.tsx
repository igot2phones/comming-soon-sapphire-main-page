import { useEffect, useRef } from "react";

type Star = {
  x: number; // 0..1 of width
  y: number; // 0..1 of height
  r: number; // radius px
  depth: number; // parallax depth 0..1 (further = smaller = slower)
  phase: number; // twinkle phase offset
  speed: number; // twinkle speed
  tint: [number, number, number]; // rgb
};

type Meteor = {
  x: number;
  y: number;
  vx: number; // px per ms
  vy: number;
  len: number; // trail length px
  life: number; // ms lived
  maxLife: number; // ms
};

type Dust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
};

// Cool sapphire-leaning palette; most stars stay near-white so the sky
// doesn't turn uniformly blue.
const TINTS: [number, number, number][] = [
  [190, 206, 255],
  [190, 206, 255],
  [190, 206, 255],
  [225, 233, 255],
  [150, 178, 255],
  [172, 160, 255],
];

/**
 * Fixed full-viewport starfield: tiny twinkling dots on three parallax
 * depths, drawn on a lightweight canvas. On top of the base field it layers
 * occasional shooting stars, a scroll-velocity "warp" (stars stretch into
 * streaks while the page moves fast) and a faint stardust trail that follows
 * a fine pointer. Client-only (everything happens in useEffect), respects
 * prefers-reduced-motion (renders a static field with no animation loop)
 * and lowers star counts on small screens.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let dust: Dust[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    let lastT = 0;
    let lastScroll = window.scrollY || 0;
    let warp = 0; // smoothed scroll velocity, px/frame
    let nextMeteorAt = 2500 + Math.random() * 5000;

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
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        };
      });
    };

    const spawnMeteor = () => {
      // Enters from the top half, streaks diagonally downward.
      const dir = Math.random() < 0.5 ? -1 : 1;
      const angle = (Math.PI / 4) * (0.75 + Math.random() * 0.5); // ~34°..56°
      const speed = 0.5 + Math.random() * 0.45; // px/ms
      meteors.push({
        x: (0.15 + Math.random() * 0.7) * width,
        y: -20 + Math.random() * height * 0.35,
        vx: Math.cos(angle) * speed * dir,
        vy: Math.sin(angle) * speed,
        len: 90 + Math.random() * 110,
        life: 0,
        maxLife: 900 + Math.random() * 600,
      });
    };

    const drawStars = (t: number) => {
      for (const s of stars) {
        // Parallax: deeper stars scroll slower than the page.
        const scroll = window.scrollY || 0;
        const py = (s.y * height - scroll * s.depth * 0.2) % height;
        const y = py < 0 ? py + height : py;
        const x = s.x * width;
        const tw = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
        const alpha = (0.25 + 0.6 * tw) * (0.35 + 0.65 * s.depth);
        const [cr, cg, cb] = s.tint;
        // Warp: while the page scrolls fast, stars smear into streaks along
        // the scroll axis — nearer stars stretch further.
        const stretch = Math.min(Math.abs(warp) * s.depth * 0.9, 44);
        if (stretch > 2) {
          const half = stretch / 2;
          const grad = ctx.createLinearGradient(x, y - half, x, y + half);
          grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          grad.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, ${(alpha * 0.9).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.r * 1.4;
          ctx.beginPath();
          ctx.moveTo(x, y - half);
          ctx.lineTo(x, y + half);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    const drawMeteors = (dt: number) => {
      meteors = meteors.filter((m) => m.life < m.maxLife);
      for (const m of meteors) {
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const p = m.life / m.maxLife;
        // Fade in fast, fade out slow.
        const fade = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
        const tx = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.len;
        const ty = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.len;
        const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
        grad.addColorStop(0, `rgba(235, 242, 255, ${(0.85 * fade).toFixed(3)})`);
        grad.addColorStop(0.3, `rgba(160, 190, 255, ${(0.45 * fade).toFixed(3)})`);
        grad.addColorStop(1, "rgba(120, 150, 255, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        // Bright head with a soft halo.
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 246, 255, ${(0.9 * fade).toFixed(3)})`;
        ctx.fill();
      }
    };

    const drawDust = (dt: number) => {
      dust = dust.filter((d) => d.life < d.maxLife);
      for (const d of dust) {
        d.life += dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.vy -= 0.00004 * dt; // gentle upward lift, like embers
        const p = d.life / d.maxLife;
        const fade = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * (1 - p * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(175, 198, 255, ${(0.65 * fade).toFixed(3)})`;
        ctx.fill();
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      drawStars(t);
      if (!reduced) {
        const dt = lastT ? Math.min(t - lastT, 64) : 16;
        drawMeteors(dt);
        drawDust(dt);
        if (t > nextMeteorAt && meteors.length < 3) {
          spawnMeteor();
          nextMeteorAt = t + 4000 + Math.random() * 8000;
        }
      }
    };

    const loop = (t: number) => {
      const scroll = window.scrollY || 0;
      warp = warp * 0.88 + (scroll - lastScroll) * 0.12;
      lastScroll = scroll;
      draw(t);
      lastT = t;
      raf = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dust.length >= 70) return;
      const n = 1 + (Math.random() < 0.35 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.008 + Math.random() * 0.03;
        dust.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: 0.5 + Math.random() * 1.1,
          life: 0,
          maxLife: 500 + Math.random() * 700,
        });
      }
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
    if (finePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (finePointer) window.removeEventListener("pointermove", onPointerMove);
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
