import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getMySubmittedReport = async (caseId) => {
  const endpoint = apiConfig.engineer.getMySubmittedReport.replace(
    ":caseId",
    encodeURIComponent(caseId),
  );
  const response = await api.get(endpoint);
  return response.data;
};

export default getMySubmittedReport;
