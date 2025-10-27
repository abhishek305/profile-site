import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TerminalLine } from '@/types';

interface TerminalState {
  isOpen: boolean;
  lines: TerminalLine[];
  hasRun: boolean;
}

const initialState: TerminalState = {
  isOpen: false,
  lines: [],
  hasRun: false,
};

const terminalSlice = createSlice({
  name: 'terminal',
  initialState,
  reducers: {
    toggleTerminal: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
      if (state.isOpen && !state.hasRun) {
        state.hasRun = true;
      }
    },
    addTerminalLine: (state, action: PayloadAction<Omit<TerminalLine, 'id'>>) => {
      state.lines.push({
        ...action.payload,
        id: Date.now().toString() + Math.random(),
      });
    },
    clearTerminal: (state) => {
      state.lines = [];
    },
  },
});

export const { toggleTerminal, addTerminalLine, clearTerminal } = terminalSlice.actions;
export default terminalSlice.reducer;

