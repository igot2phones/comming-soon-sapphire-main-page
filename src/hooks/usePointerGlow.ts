import { useEffect, useRef } from "react";

/**
 * Mouse-tracking spotlight (+ optional 3D tilt) for cards.
 * Attach the returned ref to an element with the `.spotlight-card` class;
 * the hook feeds `--glow-x` / `--glow-y` / `--glow-o` CSS variables that the
 * class consumes for a radial spotlight fill and border glow. With
 * `tilt: true` the card also gently rotates toward the cursor.
 * Disabled for coarse pointers and prefers-reduced-motion. SSR-safe.
 */
export function usePointerGlow<T extends HTMLElement>(tilt = false, maxTilt = 3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    let inside = false;

    const apply = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const x = px - rect.left;
      const y = py - rect.top;
      el.style.setProperty("--glow-x", `${x.toFixed(1)}px`);
      el.style.setProperty("--glow-y", `${y.toFixed(1)}px`);
      el.style.setProperty("--glow-o", inside ? "1" : "0");
      if (tilt) {
        if (inside) {
          const rx = ((y / Math.max(rect.height, 1) - 0.5) * -2 * maxTilt).toFixed(2);
          const ry = ((x / Math.max(rect.width, 1) - 0.5) * 2 * maxTilt).toFixed(2);
          el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        } else {
          el.style.transform = "";
        }
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      inside = true;
      schedule();
    };
    const onLeave = () => {
      inside = false;
      schedule();
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.removeProperty("--glow-x");
      el.style.removeProperty("--glow-y");
      el.style.removeProperty("--glow-o");
      if (tilt) el.style.transform = "";
    };
  }, [tilt, maxTilt]);

  return ref;
}
