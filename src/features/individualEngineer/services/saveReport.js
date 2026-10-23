import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const saveReport = async (taskId, payload) => {
  const endpoint = apiConfig.engineer.saveMyReport.replace(
    ":taskId",
    encodeURIComponent(taskId),
  );
  const response = await api.post(endpoint, payload);
  return response.data;
};

export default saveReport;
