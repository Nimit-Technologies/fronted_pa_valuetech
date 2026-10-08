import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const updateBusinessTypeStatus = async (payload) => {
  const response = await api.patch(
    `${apiConfig.business.updateBusinessStatus}/${payload.id}`,
  );
  return response.data;
};

export default updateBusinessTypeStatus;
