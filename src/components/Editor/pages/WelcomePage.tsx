import { useAppDispatch } from "@/store/hooks";
import { openTab } from "@/store/slices/tabsSlice";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { useTerminal } from "@/hooks/useTerminal";
import { CodeIcon, CalendarIcon, ActivityIcon, TerminalIcon } from "../../icons";
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
        <img src="https://placehold.co/80x80/718096/E2E8F0?text=AE" alt="Abhishek Ezhava" className="welcome-profile-pic" />
        <div>
          <div className="welcome-profile-name">Abhishek Ezhava</div>
          <p className="welcome-profile-title">Senior Software Engineer I</p>
        </div>
      </button>

      <div className="welcome-quick-links-grid">
        <button className="welcome-quick-link-card" onClick={() => handleNavigate("skills")}>
          <CodeIcon />
          <div className="welcome-quick-link-title">Key Skills</div>
          <p className="welcome-quick-link-desc font-mono" style={{ color: "var(--accent-green)" }}>
            React / Node.js / Kafka
          </p>
        </button>

        <button className="welcome-quick-link-card" onClick={() => handleNavigate("experience")}>
          <CalendarIcon />
          <div className="welcome-quick-link-title">Latest Role</div>
          <p className="welcome-quick-link-desc">Senior Software Engineer I @ Contentstack</p>
        </button>

        <button className="welcome-quick-link-card" onClick={() => handleNavigate("github")}>
          <ActivityIcon />
          <div className="welcome-quick-link-title">GitHub Stats</div>
          <p className="welcome-quick-link-desc">View contributions & activity.</p>
        </button>

        <button className="welcome-quick-link-card" onClick={handleTerminalOpen}>
          <TerminalIcon />
          <div className="welcome-quick-link-title">Interactive Terminal</div>
          <p className="welcome-quick-link-desc">Try commands like 'help' or 'contact'.</p>
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
