import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
// GET /auth/session — confirms a persisted "logged in" Redux state is still
// backed by a valid httpOnly session cookie. 401s (via the shared axios
// interceptor) if the cookie is missing/expired/invalid.
const session = async () => {
  const response = await api.get(`${apiConfig.auth.session}`);
  return response.data;
};

export default session;
