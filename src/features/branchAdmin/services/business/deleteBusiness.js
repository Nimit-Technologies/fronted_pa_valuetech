import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const deleteBusinessType = async (businessId) => {
  const response = await api.delete(
    `${apiConfig.business.softDeleteBusiness}/${businessId}`,
  );
  return response.data;
};
export default deleteBusinessType;
