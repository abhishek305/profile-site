import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ToastContext, type ShowToast } from "./toast-context";

const VISIBLE_MS = 1800;

/**
 * Renders a single polite live region for the whole app. Demo stages and the
 * copy-email action report through `useToast()` rather than each owning a
 * status element, so a screen reader is not interrupted by several regions
 * competing to announce at once.
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback<ShowToast>((nextMessage) => {
    setMessage(nextMessage);
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div id="toast" role="status" aria-live="polite" className={visible ? "show" : ""}>
        {message}
      </div>
    </ToastContext.Provider>
  );
};
