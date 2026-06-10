import { useEffect, useRef } from "react";

/**
 * GPU-friendly scroll parallax + cursor drift.
 * Attach the returned ref to a section; descendants carrying
 * `data-parallax="0.12"` translate vertically at different rates as the
 * section moves through the viewport. Elements may additionally carry
 * `data-drift="12"` to drift subtly toward the cursor while it hovers the
 * section. Uses the independent `translate` property so it composes with
 * existing Tailwind transform classes. Disabled for coarse pointers and
 * when prefers-reduced-motion is set. SSR-safe (all work inside useEffect).
 */
export function useParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax], [data-drift]"));
    if (els.length === 0) return;

    let raf = 0;
    let scrollP = 0;
    let driftX = 0;
    let driftY = 0;

    const apply = () => {
      raf = 0;
      for (const el of els) {
        const speed = parseFloat(el.dataset.parallax ?? "0");
        const drift = parseFloat(el.dataset.drift ?? "0");
        const y = -scrollP * speed * 120 + driftY * drift;
        const x = driftX * drift;
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      scrollP = (rect.top + rect.height / 2 - vh / 2) / vh;
      schedule();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      driftX = e.clientX / Math.max(rect.width, 1) - 0.5;
      driftY = (e.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      schedule();
    };
    const onPointerLeave = () => {
      driftX = 0;
      driftY = 0;
      schedule();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      for (const el of els) el.style.translate = "";
    };
  }, []);

  return ref;
}
