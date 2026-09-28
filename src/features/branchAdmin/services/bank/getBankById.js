import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const getBankById = async (id) => {
  const response = await api.get(`${apiConfig.bank.getBankById}/${id}`);
  return response.data;
};

export default getBankById;
