import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// PATCH /case/assign/:id
const assignCase = async (caseId, employeeId) => {
  const response = await api.patch(`${apiConfig.case.assignCase}/${caseId}`, {
    employee_id: employeeId,
  });
  return response.data;
};

export default assignCase;
