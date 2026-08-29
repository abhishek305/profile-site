import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const paletteSlice = createSlice({
  name: 'palette',
  initialState: { isOpen: false },
  reducers: {
    togglePalette: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload ?? !state.isOpen;
    },
  },
});

export const { togglePalette } = paletteSlice.actions;
export default paletteSlice.reducer;
