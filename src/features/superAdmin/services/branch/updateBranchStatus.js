import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// Backend toggles is_active from the row's current value — no body needed.
const UpdateBranchStatusAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.branch.updateBranchStatus}/${payload.id}`,
  );
  return response.data;
};

export default UpdateBranchStatusAPI;
