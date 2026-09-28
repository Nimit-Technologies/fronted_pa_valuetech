import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const RestoreBankAPI = async (payload) => {
  const response = await api.patch(
    `${apiConfig.bank.restoreBank}/${payload.id}`,
  );
  return response.data;
};

export default RestoreBankAPI;
