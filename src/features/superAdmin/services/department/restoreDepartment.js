import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const RestoreDepartmentAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.department.restoreDepartment}/${payload.id}`,
  );
  return response.data;
};

export default RestoreDepartmentAPI;
