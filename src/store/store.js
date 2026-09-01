import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import authReducer from "@/features/auth/slice/authSlice";
import departmentReducer from "@/features/superAdmin/slice/department/departmentSlice";
import branchReducer from "@/features/superAdmin/slice/branch/branchSlice";
import roleReducer from "@/features/superAdmin/slice/role/roleSlice";
import userReducer from "@/features/superAdmin/slice/user/userSlice";

// Vite's dev-server CJS pre-bundling of "redux-persist/lib/storage" double-wraps
// its default export, leaving storage.getItem undefined at runtime. A plain
// localStorage adapter sidesteps that interop bug entirely.
const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) =>
    Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

// Persist only identity (user/isAuthenticated), not the transient
// loading/error fields — otherwise a refresh mid-request (or right after a
// failed attempt) can rehydrate loading: true and permanently stick the
// login button in its disabled "Logging in..." state.
const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["loading", "error"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  department: departmentReducer,
  branch: branchReducer,
  role: roleReducer,
  user: userReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
