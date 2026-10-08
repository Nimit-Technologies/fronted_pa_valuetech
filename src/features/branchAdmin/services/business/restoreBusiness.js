import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const restoreBusinessType = async (businessId) => {
  const response = await api.put(
    `${apiConfig.business.restoreBusiness}/${businessId}`,
  );
  return response.data;
};

export default restoreBusinessType;
