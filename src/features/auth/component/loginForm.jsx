import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "@/features/auth/hooks/useLogin";
import {
  ROLE_HOME_ROUTES,
  DEFAULT_AUTHENTICATED_ROUTE,
} from "@/features/auth/constants/roles";
import { takeReturnTo } from "@/features/auth/returnTo";

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

      // A page the user was trying to reach before they were sent here wins
      // over the dashboard — that is the whole point of remembering it. Read
      // once and forgotten, so a later login starts clean. ProtectedRoute
      // still guards it: a path this role may not see bounces to their own
      // dashboard, so a stale value cannot land anyone on someone else's page.
      const destination =
        takeReturnTo() ??
        ROLE_HOME_ROUTES[user.role?.name] ??
        DEFAULT_AUTHENTICATED_ROUTE;

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
        <label htmlFor="employee_id" className="block text-sm font-medium mb-2">
          Employee ID
        </label>
        <input
          id="employee_id"
          name="employee_id"
          type="text"
          // The account identifier here is the employee id, not an email, so
          // `username` is what tells a password manager which field this is.
          autoComplete="username"
          autoCapitalize="none"
          spellCheck="false"
          required
          placeholder="Enter your Employee Id"
          value={employee_id}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Inline error — in-context is more useful than a toast alone here.
          The API answers a wrong employee id and a wrong password with the
          same sentence, so nothing here reveals whether an account exists. */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* No "remember me" and no "forgot password" link: session lifetime is
          set by the API's cookie and there is nothing for a checkbox here to
          change, and password reset has no endpoint behind it yet. Controls
          that silently do nothing are worse than their absence — the link in
          particular read as a way out to anyone who was locked out. Both come
          back when the backend's reset flow does. */}

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
