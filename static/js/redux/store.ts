import { combineReducers, configureStore, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import pollReducer from 'redux/pollSlice';
import walletReducer from './walletSlice';
import contractReducer from './contractSlice';
import userReducer from './userSlice';
import { api } from 'redux/api';
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

const persistConfig = {
  key: 'reduxStoreCopy',
  version: 1,
  storage,
  whitelist: ['poll'],
};

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  poll: pollReducer,
  wallet: walletReducer,
  contract: contractReducer,
  user: userReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const rtkQueryErrorLogger : Middleware = (_: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.error(action)
    // if('payload' in action && 'data' in action.payload){
    //   toast(action.payload.data, {type:'error'})
    // }
  }
  return next(action);
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware).concat(rtkQueryErrorLogger),
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
