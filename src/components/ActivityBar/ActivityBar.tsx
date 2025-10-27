import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openTab } from "@/store/slices/tabsSlice";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { useTheme } from "@/hooks/useTheme";
import ThemePicker from "./ThemePicker";
import { HomeIcon, UserIcon, CodeIcon, CalendarIcon, ActivityIcon, PaletteIcon, LinkedInIcon, GitHubIcon } from "../icons";
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

  const navigationItems = [
    { id: "home" as PageId, icon: <HomeIcon />, title: "Home (README.md)" },
    { id: "about" as PageId, icon: <UserIcon />, title: "About (abhishek.md)" },
    { id: "skills" as PageId, icon: <CodeIcon />, title: "Skills (skills.ts)" },
    { id: "experience" as PageId, icon: <CalendarIcon />, title: "Experience (experience.json)" },
    { id: "github" as PageId, icon: <ActivityIcon />, title: "GitHub Stats (github_stats.md)" },
  ];

  return (
    <nav className="activity-bar w-16 h-full flex flex-col items-center justify-between py-5 shrink-0 relative">
      {/* Top Icons */}
      <div className="flex flex-col space-y-7">
        {navigationItems.map((item) => (
          <button key={item.id} onClick={() => handleNavigation(item.id)} className={`activity-bar-icon p-3 ${activePage === item.id ? "active" : ""}`} title={item.title}>
            {item.icon}
          </button>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col space-y-5">
        {/* Theme Toggle */}
        <button id="theme-toggle" onClick={handleThemeToggle} className="activity-bar-icon p-3" title="Change Theme">
          <PaletteIcon />
        </button>

        {/* LinkedIn */}
        <a href="https://linkedin.com/in/abhishek-ezhava" target="_blank" rel="noopener noreferrer" className="activity-bar-icon p-3" title="LinkedIn">
          <LinkedInIcon />
        </a>

        {/* GitHub */}
        <a href="https://github.com/abhishek-ezhava" target="_blank" rel="noopener noreferrer" className="activity-bar-icon p-3" title="GitHub">
          <GitHubIcon />
        </a>
      </div>

      {/* Theme Picker Menu */}
      <ThemePicker />
    </nav>
  );
};

export default ActivityBar;
