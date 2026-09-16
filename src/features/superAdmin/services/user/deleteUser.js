import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// Soft delete: the row keeps existing and can be restored.
const DeleteUserAPI = async (payload) => {
  const response = await api.delete(
    `${apiConfig.user.softDeleteUser}/${payload.id}`,
  );
  return response.data;
};

export default DeleteUserAPI;
