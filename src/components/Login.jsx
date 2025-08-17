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
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          EXPENSE TRACKER
        </h2>
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Sign in to your account
        </h2>

        {serverError && (
          <p className="mb-4 text-red-400 text-sm text-center">{serverError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col space-y-3">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: true })}
              className="w-full rounded-md bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">Username is required</p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-200"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
              autoComplete="current-password"
              className="w-full rounded-md bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">Password is required</p>
            )}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-500 px-4 py-3 text-white font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          New User? <NavLink to="/signup"> Click Here To Sign Up</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Login;
