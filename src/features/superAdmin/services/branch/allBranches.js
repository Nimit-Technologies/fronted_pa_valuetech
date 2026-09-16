import { apiConfig } from "@/constants/apiConfig";
import api from "@/utils/axiosInstance";
const getAllBranches = async (params = {}) => {
  const response = await api.get(`${apiConfig.branch.getAllBranches}`, {
    params,
  });
  return response.data;
};

export default getAllBranches;
