import LoginForm from "@/features/auth/component/loginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 z-10">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Please login to your account
        </p>

        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
