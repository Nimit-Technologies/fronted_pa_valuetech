import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const logout = async () => {
  const response = await api.post(`${apiConfig.auth.login}`);
  return response.data;
};

export default logout;
