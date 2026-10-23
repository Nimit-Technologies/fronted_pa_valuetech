import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getMyReport = async (taskId) => {
  const endpoint = apiConfig.engineer.getMyReport.replace(
    ":taskId",
    encodeURIComponent(taskId),
  );
  const response = await api.get(endpoint);
  return response.data;
};

export default getMyReport;
