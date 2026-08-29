import { useAppDispatch } from "@/store/hooks";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { togglePalette } from "@/store/slices/paletteSlice";
import { TerminalIcon, SearchIcon, GitBranchIcon } from "../icons";
import { profile } from "@/constants/profile";

const StatusBar = () => {
  const dispatch = useAppDispatch();

  return (
    <footer id="status-bar" className="h-8 px-3 sm:px-6 flex items-center justify-between text-xs sm:text-sm flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={() => dispatch(toggleTerminal())} className="status-bar-icon hover:text-[var(--text-primary)] transition-colors" title="Toggle Terminal (Ctrl+`)">
          <TerminalIcon />
          <span className="ml-1">TERMINAL</span>
        </button>

        <button onClick={() => dispatch(togglePalette(true))} className="status-bar-icon hover:text-[var(--text-primary)] transition-colors" title="Command Palette (Ctrl/Cmd+P)">
          <SearchIcon />
          <span className="ml-1">GO TO</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="footer-watermark">© {new Date().getFullYear()} {profile.name}</span>

        <span className="status-bar-icon" title="Main Branch">
          <GitBranchIcon />
          <span>main</span>
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;
