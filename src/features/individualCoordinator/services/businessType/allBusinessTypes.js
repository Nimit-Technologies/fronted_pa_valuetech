import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// GET /business/all-business-types — branch-scoped server-side, and open to a
// coordinator. Used only to put a name to the business type the session says
// the caller handles; the id itself comes from the session, never from here.
const AllBusinessTypesAPI = async (params = {}) => {
  const response = await api.get(apiConfig.business.getAllBusiness, { params });
  return response.data;
};

export default AllBusinessTypesAPI;
