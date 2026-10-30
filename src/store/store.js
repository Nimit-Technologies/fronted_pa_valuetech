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
import engineerTaskReducer from "@/features/individualEngineer/slice/engineerTaskSlice";
import cacheReducer from "@/store/slice/cache/cacheSlice";
import referenceReducer from "@/store/slice/reference/referenceSlice";

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
//  2. The persisted auth slice is only a first-paint hint; it contains no
//     identifying user details. Case rows are persisted separately to retain
//     the case dashboard across refreshes and are cleared on logout.
//
// Reducing `user` this way is safe because the stored copy is only a
// first-paint hint: useVerifySession refetches the authoritative user from
// /auth/session on every mount, and App renders nothing until that resolves,
// so no screen ever reads these fields from storage.
const reduceAuthForStorage = (state) => ({
  isAuthenticated: Boolean(state.isAuthenticated),
  user: state.user ? { role: { name: state.user.role?.name ?? null } } : null,
});

const reduceCaseForStorage = (state) => ({
  ...state,
  loading: false,
  error: null,
  success: null,
});

const reduceEngineerTasksForStorage = (state) => ({
  ...state,
  loading: false,
  error: null,
  success: null,
  currentRequestId: null,
});

const PERSISTED_SHAPE_BY_SLICE = {
  auth: reduceAuthForStorage,
  case: reduceCaseForStorage,
  engineerTask: reduceEngineerTasksForStorage,
};

const reduceForStorage = createTransform(
  (inboundState, key) => {
    const reduce = PERSISTED_SHAPE_BY_SLICE[key];
    return reduce ? reduce(inboundState) : inboundState;
  },
  (outboundState, key) =>
    PERSISTED_SHAPE_BY_SLICE[key]
      ? PERSISTED_SHAPE_BY_SLICE[key](outboundState)
      : outboundState,
);

const rootReducer = combineReducers({
  auth: authReducer,
  department: departmentReducer,
  branch: branchReducer,
  role: roleReducer,
  user: userReducer,
  case: caseReducer,
  bank: bankReducer,
  business: businessReducer,
  engineerTask: engineerTaskReducer,
  // Freshness metadata for the list slices above. Never persisted: a stale
  // fetchedAt restored from localStorage would suppress the first fetch after
  // a reload, leaving the screen empty.
  cache: cacheReducer,
  // Shared lookup lists (statuses, engineers, banks, business types). Not
  // persisted for the same reason, and because they are cheap to refetch.
  reference: referenceReducer,
});

// Auth, case and engineer task state are persisted. Other server-backed lists
// are refetched on mount.
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
  whitelist: ["auth", "case", "engineerTask"],
  transforms: [reduceForStorage],
  // The version bump above handles state that is merely *old*. This handles
  // state that is corrupt: a half-written or hand-edited localStorage entry
  // rehydrates an object of the wrong shape, and the first selector to read
  // through it throws inside PersistGate, where the app has no UI yet — a
  // blank page with no way back short of clearing site data by hand.
  //
  // Returning undefined makes redux-persist fall back to the reducers' initial
  // state, which is always safe here: the session is re-derived from the
  // cookie by useVerifySession, and the list slices refetch on mount.
  migrate: (state) => {
    if (state && typeof state !== "object") return Promise.resolve(undefined);

    const authIsUsable =
      !state?.auth ||
      (typeof state.auth === "object" &&
        (state.auth.user === null ||
          state.auth.user === undefined ||
          typeof state.auth.user === "object"));

    return Promise.resolve(authIsUsable ? state : undefined);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  // Redux Toolkit 2 defaults this to `true` — not to "on in development" as
  // RTK 1 did — so a production build quietly connects to the Redux DevTools
  // extension in any browser that has it installed. That hands over the entire
  // store: the case lists carry customer names, phone numbers and addresses,
  // and the extension's export button turns a loaded dashboard into a file.
  //
  // Keyed on vite's own MODE rather than VITE_ENV, which is an app-level label
  // that the local .env sets to "production" while running the dev server.
  devTools: import.meta.env.MODE === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
