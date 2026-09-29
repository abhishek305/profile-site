import { useSectionSpy } from "../../hooks/useSectionSpy";
import { homeSectionIds, homeSectionLabels } from "../../routes";

/**
 * Sticky index of the home page sections, marking the one currently in view.
 *
 * The observer's root margin is a narrow band across the middle of the
 * viewport, so only one section is ever "current" and the rail does not flicker
 * between neighbours while scrolling.
 */
export const Rail = () => {
  const activeId = useSectionSpy(homeSectionIds);

  return (
    <nav className="rail" aria-label="Sections on this page">
      <ol>
        {homeSectionIds.map((id) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={activeId === id ? "true" : undefined}>
              {homeSectionLabels[id]}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
