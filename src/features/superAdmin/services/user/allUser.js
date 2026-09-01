import React from "react";
import api from "@/utils/axiosInstance";
const allUser = async (params = {}) => {
  const response = await api.get("/user/all-user", {
    params,
  });
  console.log(response);
  return response.data;
};

export default allUser;
