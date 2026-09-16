import React from "react";
import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const UpdateBranchAPI = async (payload) => {
  const { id, ...branchData } = payload.data;
  const response = await api.put(
    `${apiConfig.branch.updateBranch}/${id}`,
    branchData,
  );
  return response.data;
};

export default UpdateBranchAPI;
