import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DraftFormData } from '../types/service-log.ts';

interface AutoSaveState {
  autoSave: Partial<DraftFormData> | null;
}

const initialState: AutoSaveState = { autoSave: null };

const autoSaveSlice = createSlice({
  name: 'autoSave',
  initialState,
  reducers: {
    setAutoSave: (state, action: PayloadAction<Partial<DraftFormData>>) => {
      state.autoSave = action.payload;
    },
    clearAutoSave: (state) => {
      state.autoSave = null;
    },
  },
});

export const { setAutoSave, clearAutoSave } = autoSaveSlice.actions;
export const autoSaveReducer = autoSaveSlice.reducer;
