import { useAppDispatch } from "@/store/hooks";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { TerminalIcon, BellIcon, GitBranchIcon } from "../icons";

const StatusBar = () => {
  const dispatch = useAppDispatch();

  const handleTerminalToggle = () => {
    dispatch(toggleTerminal());
  };

  return (
    <footer id="status-bar" className="h-8 px-6 flex items-center justify-between text-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Terminal Toggle */}
        <button onClick={handleTerminalToggle} className="status-bar-icon hover:text-[var(--text-primary)] transition-colors" title="Toggle Panel (Contact)">
          <TerminalIcon />
          <span className="ml-1">TERMINAL</span>
        </button>

        {/* Notification Icon */}
        <span className="status-bar-icon" title="Notifications">
          <BellIcon />
        </span>

        <span>Click the icons on the left to explore.</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Watermark */}
        <span className="footer-watermark">© 2025 Abhishek Ezhava</span>

        {/* Git Branch */}
        <span className="status-bar-icon" title="Main Branch">
          <GitBranchIcon />
          <span>main</span>
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;
