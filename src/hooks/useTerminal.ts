import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTerminal, addTerminalLine, clearTerminal } from '@/store/slices/terminalSlice';
import { openTab } from '@/store/slices/tabsSlice';
import { startMatrix } from '@/store/slices/matrixSlice';
import type { PageId } from '@/types';

export const useTerminal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, lines, hasRun } = useAppSelector((state) => state.terminal);

  const toggle = (forceOpen?: boolean) => {
    dispatch(toggleTerminal(forceOpen));
  };

  const addLine = (content: string, type: 'command' | 'output' | 'comment' = 'output') => {
    dispatch(addTerminalLine({ content, type }));
  };

  const clear = () => {
    dispatch(clearTerminal());
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCommand = async (command: string) => {
    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case 'help':
        addLine('Available commands:', 'output');
        addLine(`
          <ul style="list-style-type: ' - '; padding-left: 1rem;">
            <li><span style="color: var(--accent-yellow);">about</span>       - Navigates to the About Me page.</li>
            <li><span style="color: var(--accent-yellow);">skills</span>      - Navigates to the Skills page.</li>
            <li><span style="color: var(--accent-yellow);">experience</span>  - Navigates to the Experience page.</li>
            <li><span style="color: var(--accent-yellow);">github</span>      - Navigates to the GitHub Stats page.</li>
            <li><span style="color: var(--accent-yellow);">home</span>        - Navigates to the README page.</li>
            <li><span style="color: var(--accent-yellow);">contact</span>     - Shows contact information.</li>
            <li><span style="color: var(--accent-yellow);">help</span>        - Displays this help message.</li>
            <li><span style="color: var(--accent-yellow);">clear</span>       - Clears the terminal screen.</li>
            <li><span style="color: var(--accent-yellow);">matrix</span>      - ???</li>
          </ul>
        `, 'output');
        break;

      case 'about':
        addLine('Navigating to About Me...', 'output');
        dispatch(openTab('about' as PageId));
        break;

      case 'skills':
        addLine('Navigating to Skills...', 'output');
        dispatch(openTab('skills' as PageId));
        break;

      case 'experience':
        addLine('Navigating to Experience...', 'output');
        dispatch(openTab('experience' as PageId));
        break;

      case 'github':
        addLine('Navigating to GitHub Stats...', 'output');
        dispatch(openTab('github' as PageId));
        break;

      case 'home':
        addLine('Navigating to Home (README)...', 'output');
        dispatch(openTab('home' as PageId));
        break;

      case 'contact':
        addLine('Fetching contact details...', 'output');
        await sleep(300);
        addLine('Email: <a href="mailto:abhishekshaji1994@gmail.com">abhishekshaji1994@gmail.com</a>', 'output');
        addLine('LinkedIn: <a href="https://linkedin.com/in/abhishek-ezhava" target="_blank">linkedin.com/in/abhishek-ezhava</a>', 'output');
        addLine('GitHub: <a href="https://github.com/abhishek305" target="_blank">github.com/abhishek305</a>', 'output');
        break;

      case 'clear':
        clear();
        return; // Don't add another line after clear

      case 'matrix':
        addLine('Initiating matrix... press [Esc] to exit.', 'output');
        dispatch(startMatrix());
        break;

      case '':
        // Do nothing on empty command
        break;

      default:
        addLine(`Command not found: ${command}. Type 'help' for a list of commands.`, 'output');
    }
  };

  return {
    isOpen,
    lines,
    hasRun,
    toggle,
    addLine,
    clear,
    handleCommand,
  };
};

