import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getAllBanks = async (params = {}) => {
  const response = await api.get(`${apiConfig.bank.getAllBanks}`, { params });
  return response.data;
};

export default getAllBanks;
