import { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { useTerminal, terminalCommands } from "@/hooks/useTerminal";

const Terminal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, lines, hasRun } = useAppSelector((state) => state.terminal);
  const { handleCommand, addLine } = useTerminal();
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  // Index into history counting back from the newest; -1 means "typing a new line".
  const [historyIndex, setHistoryIndex] = useState(-1);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when new lines are added
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    // Focus input when terminal opens
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Show welcome message on first open
    if (isOpen && hasRun && lines.length === 0) {
      addLine("Welcome to the interactive terminal. Type 'help', or press Tab to complete.", "comment");
    }
  }, [isOpen, hasRun, lines.length, addLine]);

  const recallHistory = (step: number) => {
    const next = Math.min(Math.max(historyIndex + step, -1), history.length - 1);
    setHistoryIndex(next);
    setInputValue(next === -1 ? "" : history[history.length - 1 - next]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (command) {
        addLine(`$ ${command}`, "command");
        setHistory((prev) => (prev[prev.length - 1] === command ? prev : [...prev, command]));
      }
      setHistoryIndex(-1);
      handleCommand(command);
      setInputValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      recallHistory(1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      recallHistory(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const prefix = inputValue.trimStart().toLowerCase();
      const matches = terminalCommands.filter((c) => c.name.startsWith(prefix)).map((c) => c.name);
      if (matches.length === 1) {
        setInputValue(matches[0]);
      } else if (matches.length > 1 && prefix) {
        // Author-controlled (names come from terminalCommands), and the nbsp
        // separators must survive, so this one opts into raw HTML.
        addLine(matches.join("&nbsp;&nbsp;"), "comment", true);
      }
    }
  };

  const handleClose = () => {
    dispatch(toggleTerminal(false));
  };

  return (
    <div id="bottom-panel" className={`flex flex-col flex-shrink-0 ${isOpen ? "open" : ""}`}>
      <div id="terminal-header" className="flex justify-between items-center px-6 py-2 text-sm">
        <span>TERMINAL</span>
        <button onClick={handleClose} className="text-2xl leading-none p-1 rounded hover:bg-[var(--close-hover-bg)] transition-colors" title="Close Panel (Ctrl+`)" aria-label="Close terminal panel">
          &times;
        </button>
      </div>
      <div ref={contentRef} className="flex-grow p-4 sm:p-6 overflow-y-auto font-mono text-sm sm:text-[15px] leading-relaxed cursor-text" onClick={() => inputRef.current?.focus()}>
        {/* Terminal history */}
        {lines.map((line) => (
          <div key={line.id} className={`terminal-line ${line.type === "comment" ? "terminal-comment" : ""}`} dangerouslySetInnerHTML={{ __html: line.content }} />
        ))}

        {/* Input line */}
        <div className="terminal-input-line">
          <span className="terminal-prompt">$</span>
          <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="terminal-input" placeholder="Type 'help' for commands..." spellCheck={false} autoComplete="off" aria-label="Terminal input" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
