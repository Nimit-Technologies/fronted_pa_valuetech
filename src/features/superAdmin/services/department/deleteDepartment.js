import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const DeleteDepartmentAPI = async (payload) => {
  const response = await api.delete(
    `${apiConfig.department.softDeleteDepartment}/${payload.id}`,
  );
  return response.data;
};

export default DeleteDepartmentAPI;
