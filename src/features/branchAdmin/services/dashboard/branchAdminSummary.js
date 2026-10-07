import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const BranchAdminSummary = async () => {
  const response = await api.get(apiConfig.dashboard.branchAdminSummary);
  return response.data;
};

export default BranchAdminSummary;
