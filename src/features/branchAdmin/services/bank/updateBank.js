import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const UpdateBankAPI = async (payload) => {
  const { id, ...bankData } = payload;
  const response = await api.put(
    `${apiConfig.bank.updateBank}/${id}`,
    bankData,
  );
  return response.data;
};

export default UpdateBankAPI;
