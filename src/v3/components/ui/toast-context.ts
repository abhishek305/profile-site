import { createContext, useContext } from "react";

/** Shows a transient status message. Implemented by `ToastProvider`. */
export type ShowToast = (message: string) => void;

/**
 * Kept in its own module so that `Toast.tsx` can export a component and nothing
 * else, which is what lets the `react-refresh/only-export-components` rule stay
 * enabled across the project.
 */
export const ToastContext = createContext<ShowToast>(() => undefined);

export const useToast = (): ShowToast => useContext(ToastContext);
