import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "@/features/auth/hooks/useLogin";
import {
  ROLE_HOME_ROUTES,
  DEFAULT_AUTHENTICATED_ROUTE,
} from "@/features/auth/constants/roles";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const [employee_id, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await login({ employee_id, password });
      const destination =
        ROLE_HOME_ROUTES[user.role?.name] ?? DEFAULT_AUTHENTICATED_ROUTE;
      navigate(destination, { replace: true });
    } catch {
      setPassword("");
      passwordRef.current?.focus();
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Employee ID */}
      <div>
        <label className="block text-sm font-medium mb-2">Employee ID</label>
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
          ref={passwordRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Inline error — in-context is more useful than a toast alone here */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
