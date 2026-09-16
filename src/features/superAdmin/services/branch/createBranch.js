import React from "react";
import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const CreateBranchAPI = async (payload) => {
  const response = await api.post(`${apiConfig.branch.createBranch}`, payload);
  return response.data;
};

export default CreateBranchAPI;
