import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getMyTasks = async (params = {}) => {
  const response = await api.get(apiConfig.engineer.getMyTasks, { params });
  return response.data;
};

export default getMyTasks;
