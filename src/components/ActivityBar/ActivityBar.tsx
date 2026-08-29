import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openTab } from "@/store/slices/tabsSlice";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { useTheme } from "@/hooks/useTheme";
import ThemePicker from "./ThemePicker";
import { navPages } from "@/data/pages";
import { links } from "@/constants/profile";
import { PaletteIcon, LinkedInIcon, GitHubIcon } from "../icons";
import type { PageId } from "@/types";

const ActivityBar = () => {
  const dispatch = useAppDispatch();
  const activePage = useAppSelector((state) => state.tabs.activePage);
  const { togglePicker } = useTheme();

  const handleNavigation = (pageId: PageId) => {
    dispatch(openTab(pageId));
    dispatch(toggleTerminal(false)); // Close terminal on nav
  };

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePicker();
  };

  return (
    <nav className="activity-bar w-14 sm:w-16 h-full flex flex-col items-center justify-between py-5 shrink-0 relative" aria-label="Main navigation">
      {/* Top Icons — driven by the page registry in src/data/pages.tsx */}
      <div className="flex flex-col gap-4 sm:gap-7 overflow-y-auto">
        {navPages.map(({ id, icon: Icon, label, title }) => (
          <button key={id} onClick={() => handleNavigation(id)} className={`activity-bar-icon p-3 ${activePage === id ? "active" : ""}`} title={`${label} (${title})`} aria-label={`${label} (${title})`} aria-current={activePage === id ? "page" : undefined}>
            <Icon />
          </button>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <button id="theme-toggle" onClick={handleThemeToggle} className="activity-bar-icon p-3" title="Change Theme" aria-label="Change theme">
          <PaletteIcon />
        </button>

        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="activity-bar-icon p-3" title="LinkedIn" aria-label="LinkedIn profile (opens in a new tab)">
          <LinkedInIcon />
        </a>

        <a href={links.github} target="_blank" rel="noopener noreferrer" className="activity-bar-icon p-3" title="GitHub" aria-label="GitHub profile (opens in a new tab)">
          <GitHubIcon />
        </a>
      </div>

      {/* Theme Picker Menu */}
      <ThemePicker />
    </nav>
  );
};

export default ActivityBar;
