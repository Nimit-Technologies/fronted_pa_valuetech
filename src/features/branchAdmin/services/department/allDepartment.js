import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const getAllDepartments = async (params = {}) => {
  const response = await api.get(`${apiConfig.department.getAllDepartment}`, {
    params,
  });
  return response.data;
};

export default getAllDepartments;
