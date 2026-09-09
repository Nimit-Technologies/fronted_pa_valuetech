import React from "react";
import api from "@/utils/axiosInstance";

const allRole = async (params = {}) => {
  const response = await api.get("/role/all-role", {
    params,
  });
  console.log(response);
  return response.data;
};

export default allRole;
