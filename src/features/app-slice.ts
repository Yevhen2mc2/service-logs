import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ToastState } from '../types/toast.ts';

interface AppState {
  toast: ToastState;
}

const initialState: AppState = {
  toast: { open: false, message: '', severity: 'success' },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        severity?: ToastState['severity'];
      }>,
    ) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity ?? 'success',
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
  },
});

export const { showToast, hideToast } = appSlice.actions;
export const appReducer = appSlice.reducer;
