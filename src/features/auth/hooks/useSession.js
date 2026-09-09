import { useSelector } from "react-redux";

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
