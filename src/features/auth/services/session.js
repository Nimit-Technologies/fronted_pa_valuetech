import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const session = async () => {
  const response = await api.get(`${apiConfig.auth.session}`);
  return response.data;
};

export default session;
