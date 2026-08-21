import { useSelector } from "react-redux";

/**
 * The one sanctioned way to read identity/session state out of Redux.
 * Route guards and components should call this instead of reaching into
 * `useSelector((state) => state.auth)` directly, so authSlice's shape can
 * evolve without touching every call site.
 */

export const useSession = () => {
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  return {
    user,
    isAuthenticated,
    role: user?.role?.name ?? null,
    loading,
    error,
  };
};

export default useSession;
