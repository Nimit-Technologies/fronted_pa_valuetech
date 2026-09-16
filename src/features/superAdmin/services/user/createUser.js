import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const CreateUserAPI = async (payload) => {
  const response = await api.post(apiConfig.user.createUser, payload);
  return response.data;
};

export default CreateUserAPI;
