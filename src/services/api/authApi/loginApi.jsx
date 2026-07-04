import api from "../axios";
const loginUser = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export default loginUser;
