import { useEffect, useRef } from "react";

/**
 * Magnetic hover: the element is gently pulled toward the cursor while
 * hovered and springs back to rest on leave. Runs its own rAF lerp (no CSS
 * transition, so Tailwind `transition` utilities on the element are left
 * untouched) and writes the independent `translate` property so it composes
 * with existing transform classes. Disabled for coarse pointers and
 * prefers-reduced-motion. SSR-safe (all work inside useEffect).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let raf = 0;
    let inside = false;
    let tx = 0; // target offset
    let ty = 0;
    let cx = 0; // current offset
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      const settled = !inside && Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1;
      if (settled) {
        cx = 0;
        cy = 0;
        el.style.translate = "0px 0px";
        raf = 0;
        return;
      }
      el.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`;
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      // Measure from the untranslated center so following the cursor
      // doesn't feed back into the offset.
      const baseX = rect.left + rect.width / 2 - cx;
      const baseY = rect.top + rect.height / 2 - cy;
      tx = (e.clientX - baseX) * strength;
      ty = (e.clientY - baseY) * strength;
      inside = true;
      wake();
    };
    const onLeave = () => {
      inside = false;
      tx = 0;
      ty = 0;
      wake();
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.style.translate = "";
    };
  }, [strength]);

  return ref;
}
