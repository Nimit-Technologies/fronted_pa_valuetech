import React from "react";
import api from "@/utils/axiosInstance";
// import { branchData } from '../../data/branch/branchTable';
const DeleteBranchAPI = async (payload) => {
  // const {id , ...branchData} = payload.data;
  const response = await api.delete(`/soft-delete/${payload.id}`);
  return response.data;
};

export default DeleteBranchAPI;
