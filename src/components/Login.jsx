import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthProvider";

function Login() {
  const { login } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserAuthenticated() {
      try {
        const response = await axios.get("/api/v1/auth/check-auth", {
          withCredentials: true,
        });
        if (response.data.success) {
          setIsAuthenticated(true);
          if (isAuthenticated) navigate("/home");
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    }
    checkUserAuthenticated();
  }, [navigate, isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await axios.post(
        "/api/v1/auth/login",
        {
          username: data.username,
          password: data.password,
        },
        {
          withCredentials: true, // Add this for cookie-based auth
        }
      );

      if (response.data.success) {
        await login();
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Error response:", error.response.data);

        if (error.response.data?.message) {
          setServerError(error.response.data.message);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      } else if (error.request) {
        console.error("No response received from server:", error.request);
        setServerError("No response from server. Please try again.");
      } else {
        console.error("Error setting up the request:", error.message);
        setServerError("Request setup error. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Header with icon - matches Home navbar style */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M5 6h14M7 14h10M9 18h6"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Expense Tracker
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              Sign in to your account
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-600 text-sm font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                {...register("username", { required: true })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  Username is required
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
                autoComplete="current-password"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transform transition-transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            New user?{" "}
            <NavLink
              to="/signup"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
