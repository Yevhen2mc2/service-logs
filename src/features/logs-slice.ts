import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ServiceLog, DraftFormData } from '../types/service-log.ts';

interface LogsState {
  logs: ServiceLog[];
}

const initialState: LogsState = { logs: [] };

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog: (
      state,
      action: PayloadAction<DraftFormData & { draft: boolean }>,
    ) => {
      const now = new Date().toISOString();
      state.logs.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      });
    },
    updateLog: (state, action: PayloadAction<ServiceLog>) => {
      const index = state.logs.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteLog: (state, action: PayloadAction<string>) => {
      state.logs = state.logs.filter((l) => l.id !== action.payload);
    },
  },
});

export const { addLog, updateLog, deleteLog } = logsSlice.actions;
export const logsReducer = logsSlice.reducer;
