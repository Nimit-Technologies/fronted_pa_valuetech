import api from "@/utils/axiosInstance";

const createUser = async (payload) => {
  const response = await api.post("/user/create-user", payload);
  return response.data;
};

export default createUser;
