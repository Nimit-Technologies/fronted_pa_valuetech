import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// Backend toggles is_active from the row's current value — no body needed.
const UpdateRoleStatusAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.role.updateRoleStatus}/${payload.id}`,
  );
  return response.data;
};

export default UpdateRoleStatusAPI;
