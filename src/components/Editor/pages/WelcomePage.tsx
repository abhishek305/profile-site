import { useAppDispatch } from "@/store/hooks";
import { openTab } from "@/store/slices/tabsSlice";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { togglePalette } from "@/store/slices/paletteSlice";
import { useTerminal } from "@/hooks/useTerminal";
import { CodeIcon, CalendarIcon, PackageIcon, TerminalIcon } from "../../icons";
import { profile } from "@/constants/profile";
import type { PageId } from "@/types";

const WelcomePage = () => {
  const dispatch = useAppDispatch();
  const { handleCommand } = useTerminal();

  const handleNavigate = (pageId: PageId) => {
    dispatch(openTab(pageId));
  };

  const handleTerminalOpen = () => {
    dispatch(toggleTerminal(true));
    setTimeout(() => handleCommand("help"), 100);
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Welcome to my Portfolio
        </h1>
        <p className="text-lg">An interactive IDE-themed look at my skills and experience.</p>
      </div>

      <button className="welcome-profile" onClick={() => handleNavigate("about")}>
        <span className="welcome-profile-pic hero-avatar" aria-hidden="true">
          AE
        </span>
        <div>
          <div className="welcome-profile-name">{profile.name}</div>
          <p className="welcome-profile-title">
            {profile.title} — {profile.focus}
          </p>
        </div>
      </button>

      <div className="welcome-quick-links-grid">
        <button className="welcome-quick-link-card" onClick={() => handleNavigate("skills")}>
          <CodeIcon />
          <div className="welcome-quick-link-title">Key Skills</div>
          <p className="welcome-quick-link-desc font-mono" style={{ color: "var(--accent-green)" }}>
            React / TypeScript / MCP
          </p>
        </button>

        <button className="welcome-quick-link-card" onClick={() => handleNavigate("experience")}>
          <CalendarIcon />
          <div className="welcome-quick-link-title">Latest Role</div>
          <p className="welcome-quick-link-desc">Senior Software Engineer I @ Contentstack</p>
        </button>

        <button className="welcome-quick-link-card" onClick={() => handleNavigate("projects")}>
          <PackageIcon />
          <div className="welcome-quick-link-title">Projects</div>
          <p className="welcome-quick-link-desc">MCP tooling, agents, and developer utilities.</p>
        </button>

        <button className="welcome-quick-link-card" onClick={handleTerminalOpen}>
          <TerminalIcon />
          <div className="welcome-quick-link-title">Interactive Terminal</div>
          <p className="welcome-quick-link-desc">Try commands like 'help' or 'contact'.</p>
        </button>
      </div>

      <button className="welcome-palette-hint font-mono" onClick={() => dispatch(togglePalette(true))}>
        Press <kbd>Ctrl</kbd>
        <span>/</span>
        <kbd>&#8984;</kbd> + <kbd>P</kbd> to jump anywhere
      </button>
    </div>
  );
};

export default WelcomePage;
