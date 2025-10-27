import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme, toggleThemePicker, closeThemePicker } from '@/store/slices/themeSlice';
import type { ThemeId } from '@/types';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { currentTheme, isPickerOpen } = useAppSelector((state) => state.theme);

  useEffect(() => {
    // Set initial theme on mount
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeId: ThemeId) => {
    dispatch(setTheme(themeId));
  };

  const togglePicker = () => {
    dispatch(toggleThemePicker());
  };

  const closePicker = () => {
    dispatch(closeThemePicker());
  };

  return {
    currentTheme,
    isPickerOpen,
    changeTheme,
    togglePicker,
    closePicker,
  };
};

