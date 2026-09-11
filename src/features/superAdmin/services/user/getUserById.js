import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const getUserById = async (id) => {
  const response = await api.get(`${apiConfig.user.getUserById}/${id}`);
  return response.data;
};

export default getUserById;
