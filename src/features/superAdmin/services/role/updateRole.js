import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const UpdateRoleAPI = async (payload) => {
  const { id, ...roleData } = payload.data;
  const response = await api.put(
    `${apiConfig.role.updateRole}/${id}`,
    roleData,
  );
  return response.data;
};

export default UpdateRoleAPI;
