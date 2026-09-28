import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const updateDepartment = async (payload) => {
  const { id, ...departmentData } = payload.data;
  const response = await api.put(
    `${apiConfig.department.updateDepartment}/${id}`,
    departmentData,
  );
  return response.data;
};

export default updateDepartment;
