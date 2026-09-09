import React from "react";
import api from "@/utils/axiosInstance";
const CreateDepartmentAPI = async (payload) => {
  const response = await api.post("/department/create-department", payload);

  return response.data;
};

export default CreateDepartmentAPI;
