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
import { logsReducer } from '../features/logs-slice.ts';
import { appReducer } from '../features/app-slice.ts';

const appPersistConfig = {
  key: 'app',
  version: 1,
  storage,
  blacklist: ['toast'],
};

const logsPersistConfig = { key: 'logs', version: 1, storage };

const persistedAppReducer = persistReducer(appPersistConfig, appReducer);
const persistedLogsReducer = persistReducer(logsPersistConfig, logsReducer);

export const store = configureStore({
  reducer: {
    app: persistedAppReducer,
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
