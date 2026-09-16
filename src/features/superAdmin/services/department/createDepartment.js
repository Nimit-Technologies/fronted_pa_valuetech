import React from "react";
import api from "@/utils/axiosInstance";
import { apiConfig } from "@/constants/apiConfig";
const CreateDepartmentAPI = async (payload) => {
  const response = await api.post(
    apiConfig.department.createDepartment,
    payload,
  );

  return response.data;
};

export default CreateDepartmentAPI;
