import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal. Attach the returned ref to a container; every
 * descendant carrying `data-reveal` fades/slides/blurs in once it scrolls
 * into view. Stagger per element with `style={{ "--reveal-delay": "0.2s" }}`.
 * Observer options can be overridden per container — e.g. elements pinned to
 * the very bottom of the page need `rootMargin: "0px"`, since the default
 * -8% bottom inset would keep them from ever intersecting. SSR-safe
 * (IntersectionObserver only touched inside useEffect) and honors
 * prefers-reduced-motion via the CSS in styles.css.
 */
export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (root.hasAttribute("data-reveal")) targets.push(root);
    if (targets.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px", ...optionsRef.current },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return ref;
}
