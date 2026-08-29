import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { togglePalette } from "@/store/slices/paletteSlice";
import { openTab } from "@/store/slices/tabsSlice";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { startMatrix } from "@/store/slices/matrixSlice";
import { setTheme } from "@/store/slices/themeSlice";
import { navPages } from "@/data/pages";
import { themes } from "@/constants/themes";
import { SearchIcon } from "../icons";

interface Command {
  id: string;
  label: string;
  group: string;
  run: () => void;
}

/** Sequential subsequence match, VS Code style: "gh" matches "GitHub Stats". */
const fuzzyMatch = (query: string, text: string) => {
  const haystack = text.toLowerCase();
  let cursor = 0;
  for (const char of query.toLowerCase()) {
    cursor = haystack.indexOf(char, cursor);
    if (cursor === -1) return false;
    cursor += 1;
  }
  return true;
};

const CommandPalette = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.palette.isOpen);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...navPages.map((page) => ({
        id: `go:${page.id}`,
        label: `${page.label} — ${page.title}`,
        group: "Go to File",
        run: () => dispatch(openTab(page.id)),
      })),
      ...themes.map((theme) => ({
        id: `theme:${theme.id}`,
        label: `Color Theme: ${theme.name}`,
        group: "Preferences",
        run: () => dispatch(setTheme(theme.id)),
      })),
      { id: "cmd:terminal", label: "View: Toggle Terminal", group: "View", run: () => dispatch(toggleTerminal()) },
      { id: "cmd:matrix", label: "Run: Enter the Matrix", group: "View", run: () => dispatch(startMatrix()) },
    ],
    [dispatch]
  );

  const results = useMemo(() => (query.trim() ? commands.filter((command) => fuzzyMatch(query.trim(), command.label)) : commands), [commands, query]);

  // Reset each time the palette opens, and keep the cursor inside the results.
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelected(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected((current) => Math.min(current, Math.max(results.length - 1, 0)));
  }, [results.length]);

  useEffect(() => {
    listRef.current?.children[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!isOpen) return null;

  const close = () => dispatch(togglePalette(false));

  const runCommand = (command: Command | undefined) => {
    if (!command) return;
    command.run();
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setSelected((current) => (results.length ? (current + step + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[selected]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const activeId = results[selected]?.id;

  return (
    <div className="palette-backdrop" onClick={close} role="presentation">
      <div className="palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-input-row">
          <SearchIcon />
          <input autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} className="palette-input font-mono" placeholder="Go to file or run a command…" spellCheck={false} autoComplete="off" role="combobox" aria-expanded aria-controls="palette-results" aria-activedescendant={activeId} aria-label="Search commands" />
        </div>
        <ul ref={listRef} id="palette-results" className="palette-results" role="listbox" aria-label="Commands">
          {results.length === 0 && <li className="palette-empty">No matching commands</li>}
          {results.map((command, index) => (
            <li key={command.id} id={command.id} role="option" aria-selected={index === selected} className={`palette-item ${index === selected ? "active" : ""}`} onClick={() => runCommand(command)} onMouseEnter={() => setSelected(index)}>
              <span className="palette-item-label">{command.label}</span>
              <span className="palette-item-group font-mono">{command.group}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;
