import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const saveAssets = async (taskId, payload) => {
  const endpoint = apiConfig.engineer.saveMyAssets.replace(
    ":taskId",
    encodeURIComponent(taskId),
  );
  const response = await api.post(endpoint, payload);
  return response.data;
};

export default saveAssets;
