import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const CreateBankAPI = async (payload) => {
  const response = await api.post(`${apiConfig.bank.createBank}`, payload);
  return response.data;
};

export default CreateBankAPI;
