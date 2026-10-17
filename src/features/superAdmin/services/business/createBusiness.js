import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const createBusinessType = async (data) => {
  const response = await api.post(`${apiConfig.business.createBusiness}`, data);
  return response.data;
};

export default createBusinessType;
