import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// Soft delete: the row keeps existing and can be restored server-side.
const DeleteRoleAPI = async (payload) => {
  const response = await api.delete(
    `${apiConfig.role.softDeleteRole}/${payload.id}`,
  );
  return response.data;
};

export default DeleteRoleAPI;
