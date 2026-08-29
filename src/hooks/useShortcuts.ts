import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { togglePalette } from '@/store/slices/paletteSlice';
import { toggleTerminal } from '@/store/slices/terminalSlice';

/** VS Code's real bindings, so muscle memory works on the site too. */
export const useShortcuts = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      const key = e.key.toLowerCase();
      if (key === 'p' || key === 'k') {
        e.preventDefault(); // Ctrl+P is browser print, Cmd+K is a browser search box.
        dispatch(togglePalette());
      } else if (key === '`') {
        e.preventDefault();
        dispatch(toggleTerminal());
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch]);
};
