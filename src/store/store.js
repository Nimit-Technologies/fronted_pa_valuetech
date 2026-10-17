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
import departmentReducer from "@/store/slice/department/departmentSlice";
import branchReducer from "@/store/slice/branch/branchSlice";
import roleReducer from "@/store/slice/role/roleSlice";
import userReducer from "@/store/slice/user/userSlice";
import caseReducer from "@/store/slice/case/caseSlice";
import bankReducer from "@/features/branchAdmin/slice/bank/bankSlice";
import businessReducer from "@/features/superAdmin/slice/business/businessSlice";
import cacheReducer from "@/store/slice/cache/cacheSlice";

// Vite's dev-server CJS pre-bundling of "redux-persist/lib/storage" double-wraps
// its default export, leaving storage.getItem undefined at runtime. A plain
// localStorage adapter sidesteps that interop bug entirely.
const storage = {
  getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: (key, value) =>
    Promise.resolve(window.localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
};

// Reduces each whitelisted slice to the little that may be written to
// localStorage. Two reasons:
//
//  1. Transient fields must not come back. A refresh mid-request would
//     otherwise rehydrate `loading: true` and leave a button stuck on
//     "Logging in..." forever.
//  2. Nothing identifying belongs in localStorage. It is readable by any
//     script on the origin and survives logout until overwritten, so the
//     stored user is cut down to the role name — no email, phone, employee id,
//     Aadhaar, branch or business type.
//
// Reducing `user` this way is safe because the stored copy is only a
// first-paint hint: useVerifySession refetches the authoritative user from
// /auth/session on every mount, and App renders nothing until that resolves,
// so no screen ever reads these fields from storage.
const reduceAuthForStorage = (state) => ({
  isAuthenticated: Boolean(state.isAuthenticated),
  user: state.user ? { role: { name: state.user.role?.name ?? null } } : null,
});

const PERSISTED_SHAPE_BY_SLICE = {
  auth: reduceAuthForStorage,
};

const reduceForStorage = createTransform((inboundState, key) => {
  const reduce = PERSISTED_SHAPE_BY_SLICE[key];
  return reduce ? reduce(inboundState) : inboundState;
});

const rootReducer = combineReducers({
  auth: authReducer,
  department: departmentReducer,
  branch: branchReducer,
  role: roleReducer,
  user: userReducer,
  case: caseReducer,
  bank: bankReducer,
  business: businessReducer,
  // Freshness metadata for the list slices above. Never persisted: a stale
  // fetchedAt restored from localStorage would suppress the first fetch after
  // a reload, leaving the screen empty.
  cache: cacheReducer,
});

// Only `auth` is persisted; the superAdmin slices (department/branch/role/user,
// plus `business`), the shared `case` slice and the branchAdmin `bank` slice are
// server-cache-like and refetched on mount, so there's nothing to persist.
const persistConfig = {
  key: "root",
  // Bumped to 2 when the persisted auth shape was cut down to the role name.
  // reduceForStorage only governs new writes, so without this bump a browser
  // that stored the full user under v1 would keep that copy — including the
  // email, phone and masked Aadhaar — until the next write. A version mismatch
  // makes redux-persist discard the stored state instead, and the session is
  // restored from the cookie by useVerifySession anyway.
  version: 2,
  storage,
  whitelist: ["auth"],
  transforms: [reduceForStorage],
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
