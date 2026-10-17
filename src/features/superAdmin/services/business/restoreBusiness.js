import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";

// PATCH, not PUT: the route is `router.patch("/restore/:id")`, and nothing
// else in the router matches PUT /business/restore/:id — `/update/:id` is a
// different literal path — so a PUT fell through to the catch-all 404.
const restoreBusinessType = async (businessId) => {
  const response = await api.patch(
    `${apiConfig.business.restoreBusiness}/${businessId}`,
  );
  return response.data;
};

export default restoreBusinessType;
