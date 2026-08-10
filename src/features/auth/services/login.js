import api from "@/utils/axiosInstance";

const login = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export default login;
