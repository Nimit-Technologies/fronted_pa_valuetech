import React from "react";
import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const DeleteBranchAPI = async (payload) => {
  const response = await api.delete(
    `${apiConfig.branch.softDeleteBranch}/${payload.id}`,
  );
  return response.data;
};

export default DeleteBranchAPI;
