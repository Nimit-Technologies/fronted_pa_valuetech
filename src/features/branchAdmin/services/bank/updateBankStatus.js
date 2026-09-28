import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const UpdateBankStatusAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.bank.updateBankStatus}/${payload.id}`,
  );
  return response.data;
};

export default UpdateBankStatusAPI;
