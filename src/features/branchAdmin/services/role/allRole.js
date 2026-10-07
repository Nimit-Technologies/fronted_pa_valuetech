import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const AllRoleAPI = async (params = {}) => {
  const response = await api.get(apiConfig.role.getAllRole, { params });
  return response.data;
};

export default AllRoleAPI;
