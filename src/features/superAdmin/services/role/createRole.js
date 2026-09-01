import React from "react";
import api from "@/utils/axiosInstance";
const createRole = async (payload) => {
  const response = await api.post("/role/create-role", payload);

  return response.data;
};

export default createRole;
