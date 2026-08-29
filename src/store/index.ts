import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import tabsReducer from './slices/tabsSlice';
import terminalReducer from './slices/terminalSlice';
import matrixReducer from './slices/matrixSlice';
import paletteReducer from './slices/paletteSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tabs: tabsReducer,
    terminal: terminalReducer,
    matrix: matrixReducer,
    palette: paletteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

