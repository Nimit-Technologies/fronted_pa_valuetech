import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import loginUser from "../../services/api/authApi/loginApi";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (payload) => {
    try {
      setLoading(true);
      setError("");
      console.log("Payload in useLogin:", payload); // Debugging line
      const data = await loginUser(payload);
      console.log("Login successful, received data:", data); // Debugging line
      dispatch(
        login({
          user: data,
          token: data.token,
        }),
      );

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/super-admin");
      }, 1000);
    } catch (err) {
      const message = err.response?.data?.message;
      // console.error("Error response:",message); // Debugging line
      setError(message);
      toast.error(err.response?.data?.message || "Login failed");
      // console.error("Login error:", error); // Debugging line
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};

export default useLogin;
