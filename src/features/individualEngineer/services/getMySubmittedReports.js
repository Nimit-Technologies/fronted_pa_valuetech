import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getMySubmittedReports = async (page = 1) => {
  const response = await api.get(apiConfig.engineer.getMySubmittedReports, {
    params: { page },
  });
  return response.data;
};

export default getMySubmittedReports;
