import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const login = async (payload) => {
  const response = await api.post(`${apiConfig.auth.login}`, payload);
  return response.data;
};

export default login;
