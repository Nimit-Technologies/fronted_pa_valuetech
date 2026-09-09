import React from "react";
import api from "@/utils/axiosInstance";
const updateRole = async (payload) => {
  const { id, ...roleData } = payload.data;
  const response = await api.put(`/branch/update/${id}`, roleData);
  return response.data;
};

export default updateRole;
