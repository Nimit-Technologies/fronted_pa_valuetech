import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getAssets = async (taskId) => {
  const endpoint = apiConfig.engineer.getMyAssets.replace(
    ":taskId",
    encodeURIComponent(taskId),
  );
  const response = await api.get(endpoint);
  return response.data;
};

export default getAssets;
