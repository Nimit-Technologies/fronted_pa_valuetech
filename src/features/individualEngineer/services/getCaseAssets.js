import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getCaseAssets = async (caseId) => {
  const endpoint = apiConfig.engineer.getCaseAssets.replace(
    ":caseId",
    encodeURIComponent(caseId),
  );
  const response = await api.get(endpoint);
  return response.data;
};

export default getCaseAssets;
