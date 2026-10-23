import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const transitionEngineerCase = async (caseId, statusCode) => {
  const response = await api.patch(
    `${apiConfig.case.updateCaseStatus}/${encodeURIComponent(caseId)}`,
    { status: statusCode },
  );
  return response.data;
};

export default transitionEngineerCase;
