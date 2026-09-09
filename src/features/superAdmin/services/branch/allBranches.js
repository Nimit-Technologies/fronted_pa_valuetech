import React from "react";
import api from "@/utils/axiosInstance";
const AllBranchesAPI = async (params = {}) => {
  const response = await api.get("/branch/all-branch", {
    params,
  });
  return response.data;
};

export default AllBranchesAPI;
