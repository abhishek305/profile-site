import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTerminal, addTerminalLine, clearTerminal } from '@/store/slices/terminalSlice';
import { openTab } from '@/store/slices/tabsSlice';
import { startMatrix } from '@/store/slices/matrixSlice';
import { togglePalette } from '@/store/slices/paletteSlice';
import { setTheme } from '@/store/slices/themeSlice';
import { navPages } from '@/data/pages';
import { themes } from '@/constants/themes';
import { links, profile } from '@/constants/profile';
import type { PageId } from '@/types';

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * Terminal lines are rendered with dangerouslySetInnerHTML so author-written
 * output can carry markup (links, colour spans). Anything derived from what the
 * visitor typed MUST be escaped first — echoing it raw executes it. addLine()
 * escapes by default; pass html=true only for strings written in this file.
 */
export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);

const yellow = (text: string) => `<span style="color: var(--accent-yellow);">${text}</span>`;

/** Navigation commands come straight from the page registry. */
const navCommands = navPages.map(({ id, label, title }) => ({ id, label, title }));

/** Everything the terminal knows how to do, for `help` and tab completion. */
export const terminalCommands = [
  ...navCommands.map((page) => ({ name: page.id as string, help: `Opens ${page.title}` })),
  { name: 'contact', help: 'Shows contact information.' },
  { name: 'theme', help: 'Sets a theme: theme <name>. Bare `theme` lists them.' },
  { name: 'palette', help: 'Opens the command palette (Ctrl/Cmd+P).' },
  { name: 'help', help: 'Displays this help message.' },
  { name: 'clear', help: 'Clears the terminal screen.' },
  { name: 'matrix', help: '???' },
];

const width = Math.max(...terminalCommands.map((c) => c.name.length)) + 2;
// HTML collapses runs of spaces, so pad with nbsp to actually line the help up.
const pad = (name: string) => name + '&nbsp;'.repeat(width - name.length);

export const useTerminal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, lines, hasRun } = useAppSelector((state) => state.terminal);

  const toggle = (forceOpen?: boolean) => {
    dispatch(toggleTerminal(forceOpen));
  };

  /** Escapes by default. html=true is an explicit opt-in for author-written markup. */
  const addLine = (content: string, type: 'command' | 'output' | 'comment' = 'output', html = false) => {
    dispatch(addTerminalLine({ content: html ? content : escapeHtml(content), type }));
  };

  const clear = () => {
    dispatch(clearTerminal());
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleCommand = async (command: string) => {
    const [cmd, ...rest] = command.toLowerCase().trim().split(/\s+/);
    const arg = rest.join(' ');

    const navTarget = navCommands.find((page) => page.id === cmd);
    if (navTarget) {
      addLine(`Opening ${navTarget.title}...`);
      dispatch(openTab(navTarget.id as PageId));
      return;
    }

    switch (cmd) {
      case 'help':
        addLine('Available commands:');
        addLine(`
          <ul style="list-style-type: ' - '; padding-left: 1rem;">
            ${terminalCommands.map((c) => `<li>${yellow(pad(c.name))}${c.help}</li>`).join('')}
          </ul>
          <p style="margin-top: 0.5rem;">Shortcuts: ${yellow('Ctrl/Cmd+P')} command palette &middot; ${yellow('Ctrl+`')} toggle terminal &middot; ${yellow('&uarr;/&darr;')} history &middot; ${yellow('Tab')} complete</p>
        `, 'output', true);
        break;

      case 'contact':
        addLine('Fetching contact details...');
        await sleep(300);
        addLine(`Email: <a href="${links.email}">${profile.email}</a>`, 'output', true);
        addLine(`LinkedIn: <a href="${links.linkedin}" target="_blank" rel="noopener noreferrer">linkedin.com/in/${profile.linkedinUser}</a>`, 'output', true);
        addLine(`GitHub: <a href="${links.github}" target="_blank" rel="noopener noreferrer">github.com/${profile.githubUser}</a>`, 'output', true);
        break;

      case 'theme': {
        const match = themes.find((t) => t.id === arg || t.name.toLowerCase().startsWith(arg));
        if (!arg || !match) {
          if (arg) addLine(`Unknown theme: ${arg}`);
          addLine(`Available themes: ${themes.map((t) => yellow(t.id)).join(', ')}`, 'output', true);
          break;
        }
        dispatch(setTheme(match.id));
        addLine(`Theme set to ${match.name}.`);
        break;
      }

      case 'palette':
        dispatch(togglePalette(true));
        break;

      case 'clear':
        clear();
        return; // Don't add another line after clear

      case 'matrix':
        addLine('Initiating matrix... press [Esc] to exit.');
        dispatch(startMatrix());
        break;

      case '':
        break;

      default:
        addLine(`Command not found: ${command}. Type 'help' for a list of commands.`);
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
