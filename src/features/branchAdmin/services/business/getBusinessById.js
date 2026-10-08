import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getBusinessById = async (businessId) => {
  const response = await api.get(
    `${apiConfig.business.getBusinessById}/${businessId}`,
  );
  return response.data;
};
export default getBusinessById;
