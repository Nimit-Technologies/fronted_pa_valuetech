import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getAllBusinessTypes = async (params = {}) => {
  const response = await api.get(`${apiConfig.business.getAllBusiness}`, {
    params,
  });
  return response.data;
};
export default getAllBusinessTypes;
