import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const CreateRoleAPI = async (payload) => {
  const response = await api.post(apiConfig.role.createRole, payload);
  return response.data;
};

export default CreateRoleAPI;
