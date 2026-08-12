// src/store/store.ts — single store; api reducer + slices.
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@/services/api';
import tradeFormReducer from '@/store/slices/tradeForm';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    tradeForm: tradeFormReducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
