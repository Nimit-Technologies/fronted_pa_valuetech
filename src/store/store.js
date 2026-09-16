import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createTransform,
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

// Strips each whitelisted slice's transient fields before they hit
// localStorage, so a refresh mid-request (or right after a failed attempt)
// never rehydrates e.g. `loading: true` and sticks a button in a disabled
// "Logging in..." state forever. Add an entry per slice as new persisted
// slices grow their own loading/error/transient fields.
const TRANSIENT_FIELDS_BY_SLICE = {
  auth: ["loading", "error"],
};

const stripTransientFields = createTransform((inboundState, key) => {
  const transientFields = TRANSIENT_FIELDS_BY_SLICE[key];
  if (!transientFields) return inboundState;

  return Object.fromEntries(
    Object.entries(inboundState).filter(
      ([field]) => !transientFields.includes(field),
    ),
  );
});

const rootReducer = combineReducers({
  auth: authReducer,
  department: departmentReducer,
  branch: branchReducer,
  role: roleReducer,
  user: userReducer,
});

// Only `auth` is persisted; the superAdmin slices (department/branch/role/user)
// are server-cache-like and refetched on mount, so there's nothing to persist.
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
  transforms: [stripTransientFields],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
