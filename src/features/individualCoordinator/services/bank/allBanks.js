import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// GET /bank/all-bank — open to a branch admin or a coordinator, and scoped
// server-side to the caller's branch, which is exactly the set of banks a case
// may be filed under. Cursor-paginated at DATA_LIMIT per page, with no server
// search, so the picker pages rather than searches.
const AllBanksAPI = async (params = {}) => {
  const response = await api.get(apiConfig.bank.getAllBanks, { params });
  return response.data;
};

export default AllBanksAPI;
