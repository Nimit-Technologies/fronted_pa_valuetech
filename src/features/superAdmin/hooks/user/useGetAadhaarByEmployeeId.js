import { useCallback } from "react";
import getAadhaarByEmployeeIdAPI from "@/features/superAdmin/services/user/getAadhaarByEmployeeId";
import { toast } from "sonner";

const useGetAadhaarByEmployeeId = () => {
  // Memoised so call sites can list it in a `useEffect`/`useCallback` dep array
  // without churning.
  const getAadhaarByEmployeeId = useCallback(async (employeeId) => {
    try {
      const response = await getAadhaarByEmployeeIdAPI(employeeId);
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to reveal Aadhaar number",
        {
          duration: 700,
        },
      );
      console.log("Error revealing Aadhaar", err);
      return undefined;
    }
  }, []);

  return { getAadhaarByEmployeeId };
};

export default useGetAadhaarByEmployeeId;
