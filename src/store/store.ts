import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { autoSaveReducer } from '../features/drafts/auto-save-slice.ts';
import { logsReducer } from '../features/logs/logs-slice.ts';

const autoSavePersistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['autoSave'],
};

const logsPersistConfig = { key: 'logs', version: 1, storage };

const persistedAutoSaveReducer = persistReducer(
  autoSavePersistConfig,
  autoSaveReducer,
);
const persistedLogsReducer = persistReducer(logsPersistConfig, logsReducer);

export const store = configureStore({
  reducer: {
    autoSave: persistedAutoSaveReducer,
    logs: persistedLogsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
