import api from "@/utils/axiosInstance";

const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export default logout;
