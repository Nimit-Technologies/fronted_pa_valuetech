import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// GET /case/all-case — cursor-paginated, scoped server-side to the caller.
// A coordinator gets their own branch *and* business type; no client-side
// filter is needed (or trusted) for that.
const AllCaseAPI = async (params = {}) => {
  const response = await api.get(apiConfig.case.getAllCase, { params });
  return response.data;
};

export default AllCaseAPI;
