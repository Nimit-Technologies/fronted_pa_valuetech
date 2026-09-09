import React from "react";
import api from "@/utils/axiosInstance";
const CreateBranchAPI = async (payload) => {
  const response = await api.post("branch/create-branch", payload);
  return response.data;
};

export default CreateBranchAPI;
