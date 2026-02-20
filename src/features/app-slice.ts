import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ToastState } from '../types/toast.ts';
import type { DraftFormData } from '../types/service-log.ts';

interface AppState {
  toast: ToastState;
  autoSave: Partial<DraftFormData> | null;
}

const initialState: AppState = {
  toast: { open: false, message: '', severity: 'success' },
  autoSave: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{
        message: ToastState['message'];
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
    setAutoSave: (state, action: PayloadAction<Partial<DraftFormData>>) => {
      state.autoSave = action.payload;
    },
    clearAutoSave: (state) => {
      state.autoSave = null;
    },
  },
});

export const { showToast, hideToast, setAutoSave, clearAutoSave } =
  appSlice.actions;
export const appReducer = appSlice.reducer;
