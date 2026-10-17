import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// `params` may carry direction/cursorId and, for a super admin, branchId to
// narrow the list to one branch. A branch-scoped caller's own scope always
// wins server-side, so sending branchId is a no-op for them.
const getAllBusinessTypes = async (params = {}) => {
  const response = await api.get(`${apiConfig.business.getAllBusiness}`, {
    params,
  });
  return response.data;
};
export default getAllBusinessTypes;
