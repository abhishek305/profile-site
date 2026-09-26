import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids is currently the focus of the section
 * rail. The narrow root margin means only the section crossing the middle band
 * of the viewport wins, so the rail does not flicker between neighbours.
 */
export const useSectionSpy = (sectionIds: readonly string[], enabled = true) => {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (!enabled || !("IntersectionObserver" in window)) return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds, enabled]);

  return activeId;
};
