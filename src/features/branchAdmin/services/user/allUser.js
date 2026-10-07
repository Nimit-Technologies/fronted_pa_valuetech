import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const AllUserAPI = async (params = {}) => {
  const response = await api.get(apiConfig.user.getAllUser, { params });
  return response.data;
};

export default AllUserAPI;
