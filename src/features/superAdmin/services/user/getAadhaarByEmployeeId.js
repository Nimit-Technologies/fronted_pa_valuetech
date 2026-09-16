import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// POST /api/v1/user/aadhaar  — reveals a user's Aadhaar number in the clear.
// The backend identifies the user by employee_id and audit-logs every hit.
const getAadhaarByEmployeeId = async (employeeId) => {
  const response = await api.post(apiConfig.user.getAadhaarByEmployeeId, {
    employee_id: employeeId,
  });
  return response.data;
};

export default getAadhaarByEmployeeId;
