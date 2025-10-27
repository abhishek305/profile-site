import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ThemeId } from '@/types';

interface ThemeState {
  currentTheme: ThemeId;
  isPickerOpen: boolean;
}

const getInitialTheme = (): ThemeId => {
  const stored = localStorage.getItem('portfolio-theme');
  return (stored as ThemeId) || 'dark-plus';
};

const initialState: ThemeState = {
  currentTheme: getInitialTheme(),
  isPickerOpen: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeId>) => {
      state.currentTheme = action.payload;
      localStorage.setItem('portfolio-theme', action.payload);
      document.body.setAttribute('data-theme', action.payload);
    },
    toggleThemePicker: (state) => {
      state.isPickerOpen = !state.isPickerOpen;
    },
    closeThemePicker: (state) => {
      state.isPickerOpen = false;
    },
  },
});

export const { setTheme, toggleThemePicker, closeThemePicker } = themeSlice.actions;
export default themeSlice.reducer;

