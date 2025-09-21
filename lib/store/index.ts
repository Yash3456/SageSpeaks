import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import counterReducer from './slices/counterSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['counter'], // stores only counter
};

const rootReducer = combineReducers({
  counter: counterReducer, // combines all reducers to one
});

const persistedReducer = persistReducer(persistConfig, rootReducer); // async storage is used here

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;