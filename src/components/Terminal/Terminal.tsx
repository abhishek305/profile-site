import { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTerminal } from "@/store/slices/terminalSlice";
import { useTerminal } from "@/hooks/useTerminal";

const Terminal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, lines, hasRun } = useAppSelector((state) => state.terminal);
  const { handleCommand, addLine } = useTerminal();
  const [inputValue, setInputValue] = useState("");
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
      addLine("Welcome to the interactive terminal.", "comment");
    }
  }, [isOpen, hasRun, lines.length, addLine]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (command) {
        // Add command to history
        addLine(`$ ${command}`, "command");
      }
      handleCommand(command);
      setInputValue("");
    }
  };

  const handleContentClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleClose = () => {
    dispatch(toggleTerminal(false));
  };

  return (
    <div id="bottom-panel" className={`flex flex-col flex-shrink-0 ${isOpen ? "open" : ""}`}>
      <div id="terminal-header" className="flex justify-between items-center px-6 py-2 text-sm">
        <span>TERMINAL</span>
        <button onClick={handleClose} className="text-2xl leading-none p-1 rounded hover:bg-[var(--close-hover-bg)] transition-colors" title="Close Panel">
          &times;
        </button>
      </div>
      <div ref={contentRef} className="flex-grow p-6 overflow-y-auto font-mono text-[15px] leading-relaxed cursor-text" onClick={handleContentClick}>
        {/* Terminal history */}
        {lines.map((line) => (
          <div key={line.id} className={`terminal-line ${line.type === "comment" ? "terminal-comment" : ""}`} dangerouslySetInnerHTML={{ __html: line.content }} />
        ))}

        {/* Input line */}
        <div className="terminal-input-line">
          <span className="terminal-prompt">$</span>
          <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="terminal-input" placeholder="Type 'help' for commands..." spellCheck={false} autoComplete="off" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
