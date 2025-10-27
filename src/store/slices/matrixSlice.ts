import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatrixState {
  isActive: boolean;
}

const initialState: MatrixState = {
  isActive: false,
};

const matrixSlice = createSlice({
  name: 'matrix',
  initialState,
  reducers: {
    startMatrix: (state) => {
      state.isActive = true;
    },
    stopMatrix: (state) => {
      state.isActive = false;
    },
  },
});

export const { startMatrix, stopMatrix } = matrixSlice.actions;
export default matrixSlice.reducer;

