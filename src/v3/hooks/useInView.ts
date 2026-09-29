import { useEffect, useRef, useState } from "react";

export interface InViewOptions {
  /**
   * Observe this descendant of the returned ref's element instead of the
   * element itself, e.g. `".stage-bar"`. Useful when the container is much
   * taller than the viewport, so a ratio threshold on the container could
   * never be reached.
   */
  target?: string;
  /** Margin around the root, e.g. `"420px 0px"` to fire before the element is on screen. */
  rootMargin?: string;
  threshold?: number | number[];
  /** Stop reporting after the first intersection and detach the listeners. Defaults to true. */
  once?: boolean;
  /**
   * Also check `getBoundingClientRect()` on scroll and resize, in addition to the
   * observer. IntersectionObserver callbacks can be throttled in embedded and
   * headless browsers, which otherwise left stages stuck in their loading state.
   * Defaults to true.
   */
  fallbackToScroll?: boolean;
  /**
   * Fraction of the viewport height the target must reach before it counts as
   * visible. The scroll fallback uses this in place of a raw pixel comparison.
   */
  revealAt?: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEFAULT_REVEAL_AT = 0.92;

/**
 * Reports whether a target has entered the viewport.
 *
 * This is the single implementation behind the section rail, the reading
 * progress line, the stage reveal animation and the lazy stage chunk loader,
 * all of which previously carried their own copy of the same observer.
 */
export const useInView = <T extends HTMLElement>({
  target,
  rootMargin,
  threshold = 0,
  once = true,
  fallbackToScroll = true,
  revealAt = DEFAULT_REVEAL_AT,
}: InViewOptions = {}) => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observed = (target ? element.querySelector<HTMLElement>(target) : element) ?? element;

    // With reduced motion there is nothing to animate, so show the content at once.
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(observed);

    return () => observer.disconnect();
  }, [target, rootMargin, threshold, once]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !fallbackToScroll) return;

    const observed = (target ? element.querySelector<HTMLElement>(target) : element) ?? element;

    let settled = inView;
    const update = () => {
      if (settled) return;
      const rect = observed.getBoundingClientRect();
      const visible = rect.top < window.innerHeight * revealAt && rect.bottom > 0;
      if (visible) {
        setInView(true);
        if (once) settled = true;
      } else if (!once) {
        setInView(false);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target, fallbackToScroll, once, inView, revealAt]);

  return { ref, inView };
};
