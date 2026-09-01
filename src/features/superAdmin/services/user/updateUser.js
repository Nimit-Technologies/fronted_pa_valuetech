import React from "react";
import api from "@/utils/axiosInstance";

const updateUser = async (payload) => {
  // const {id, ...userData} = payload;
  console.log("updateUser payload", payload);

  const response = await api.put(`/user/update/${payload.id}`, payload);
  console.log("updateUser response", response);
  return response.data;
};

export default updateUser;
