import React from "react";
import api from "@/utils/axiosInstance";

const allDepartments = async (params = {}) => {
  const response = await api.get("/department/all-department", {
    params,
  });
  return response.data;
};

export default allDepartments;
