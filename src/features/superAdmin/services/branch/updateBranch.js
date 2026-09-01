import React from "react";
import api from "@/utils/axiosInstance";
const UpdateBranchAPI = async (payload) => {
  const { id, ...branchData } = payload.data;
  const response = await api.put(`/branch/update/${id}`, branchData);
  return response.data;
};

export default UpdateBranchAPI;
