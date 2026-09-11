import { useCallback } from "react";
import getUserByIdAPI from "@/features/superAdmin/services/user/getUserById";
import { toast } from "sonner";

const useGetUserById = () => {
  // Memoised so callers can safely list it in a `useEffect` dependency array
  // without triggering a re-fetch loop on every render.
  const getUserById = useCallback(async (id) => {
    try {
      const response = await getUserByIdAPI(id);
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to fetch user",
        {
          duration: 700,
        },
      );
      console.log("Error in fetch user", err);
      return undefined;
    }
  }, []);

  return { getUserById };
};

export default useGetUserById;
