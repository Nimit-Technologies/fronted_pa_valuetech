import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {persistReducer , persistStore} from 'redux-persist'
import authReducer from "./slices/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ['auth'],
};



const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
       ignoreActions: ['flush', 'rehydrate', 'pause', 'persist', 'purge', 'register'],
    }),
});

export const persistor = persistStore(store);
export default store;