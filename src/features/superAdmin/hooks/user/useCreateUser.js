import React from "react";
import CreateUserAPI from "@/features/superAdmin/services/user/createUser";
import { toast } from "sonner";
const useCreateUser = () => {
  const create = async (payload) => {
    try {
      const response = await CreateUserAPI(payload);
      toast.success(response?.message || "User created successfully", {
        duration: 700,
      });
      return response;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          err?.message ||
          "Failed to create user",
        {
          duration: 700,
        },
      );
      console.log("Error in create user", err);
    }
  };
  return { create };
};

export default useCreateUser;
