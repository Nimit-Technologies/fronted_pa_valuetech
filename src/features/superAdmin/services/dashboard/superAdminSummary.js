import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// GET /dashboard/super-admin ->
// { success, data: { branches, departments, roles, users } }, each value a
// { total, active } pair (null when the server could not count it).
const SuperAdminSummaryAPI = async () => {
  const response = await api.get(apiConfig.dashboard.superAdminSummary);
  return response.data;
};

export default SuperAdminSummaryAPI;
