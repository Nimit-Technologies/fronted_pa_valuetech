import { useState } from "react";
import { Toaster } from "sonner";
import useLogin from "../../../hooks/auth/useLogin";

function Login() {
  const [employee_id, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert(`Employee ID: ${employee_id}, Password: ${password}`);

    await handleLogin({
      employee_id,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 z-10">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 ">
        <Toaster position="top-right" richColors />
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Please login to your account
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Employee ID
            </label>
            <input
              type="text"
              placeholder="Enter your Employee Id"
              value={employee_id}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>

            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
