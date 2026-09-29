import { useCallback, useState } from "react";
import { copyToClipboard } from "../lib/clipboard";
import { useToast } from "../components/ui/toast-context";

/**
 * Copies text and reports the outcome through the toast, so callers do not each
 * repeat the success/failure pair.
 */
export const useCopyAction = (text: string, successMessage: string) => {
  const toast = useToast();
  const [copying, setCopying] = useState(false);

  const copy = useCallback(async () => {
    setCopying(true);
    try {
      toast((await copyToClipboard(text)) ? successMessage : "Copy is not available here");
    } finally {
      setCopying(false);
    }
  }, [text, successMessage, toast]);

  return { copy, copying };
};
