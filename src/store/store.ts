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

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['autoSave'],
};

const persistedAutoSaveReducer = persistReducer(persistConfig, autoSaveReducer);

export const store = configureStore({
  reducer: { autoSave: persistedAutoSaveReducer },
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
