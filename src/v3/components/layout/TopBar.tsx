import { useScrollProgress } from "../../hooks/useScrollProgress";
import type { ThemeName } from "../../types";

const NAV_LINKS = [
  { href: "/#mcp", label: "Demos" },
  { href: "/experience", label: "Experience" },
  { href: "/code", label: "Code" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/resume", label: "Résumé" },
] as const;

/** Reading progress. Decorative: the scroll position itself conveys this. */
const ProgressLine = () => {
  const progress = useScrollProgress();
  return <span id="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />;
};

/**
 * Sticky header: identity, primary navigation and the theme toggle.
 *
 * `aria-current="page"` marks the route being viewed, which the previous
 * version did not do, and the toggle carries `aria-pressed` so its state is
 * available to assistive technology rather than only being implied by its label.
 */
export const TopBar = ({ theme, onThemeChange }: { theme: ThemeName; onThemeChange: () => void }) => {
  const nextTheme: ThemeName = theme === "dark" ? "light" : "dark";

  return (
    <header className="top">
      <div className="top-in">
        <a className="brand" href="/">
          Abhishek Ezhava
        </a>

        <nav aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <button
            className="themebtn"
            type="button"
            onClick={onThemeChange}
            aria-pressed={theme === "dark"}
            aria-label={`${nextTheme} theme`}
          >
            {nextTheme} theme
          </button>
        </nav>
      </div>

      <ProgressLine />
    </header>
  );
};
