import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const RestoreBranchAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.branch.restoreBranch}/${payload.id}`,
  );
  return response.data;
};

export default RestoreBranchAPI;
