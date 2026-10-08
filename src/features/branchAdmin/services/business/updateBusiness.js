import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const updateBusinessType = async (payload) => {
  const { businessId, ...businessData } = payload;
  const response = await api.put(
    `${apiConfig.business.updateBusiness}/${businessId}`,
    businessData,
  );
  return response.data;
};

export default updateBusinessType;
