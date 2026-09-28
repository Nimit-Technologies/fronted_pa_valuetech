import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

const DeleteBankAPI = async (payload) => {
  const response = await api.delete(
    `${apiConfig.bank.softDeleteBank}/${payload.id}`,
  );
  return response.data;
};

export default DeleteBankAPI;
