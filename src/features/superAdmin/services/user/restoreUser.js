import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const RestoreUserAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.user.restoreUser}/${payload.id}`,
  );
  return response.data;
};

export default RestoreUserAPI;
