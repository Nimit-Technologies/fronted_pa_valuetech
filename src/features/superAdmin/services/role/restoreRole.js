import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const RestoreRoleAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.role.restoreRole}/${payload.id}`,
  );
  return response.data;
};

export default RestoreRoleAPI;
