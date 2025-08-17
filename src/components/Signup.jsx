import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const response = await axios.post("/api/v1/auth/register", {
        fullName: data.fullname,
        gender: data.gender,
        dob: data.dob,
        username: data.username,
        password: data.password,
      });

      if (response.data.success) {
        navigate("/");
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
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          EXPENSE TRACKER
        </h2>
        <h2 className="text-xl font-semibold text-white text-center mb-6">
          Create New Account
        </h2>
        {serverError && (
          <p className="mb-4 text-red-400 text-sm text-center">{serverError}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="fullname"
              className="text-sm font-medium text-gray-200"
            >
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              {...register("fullname", { required: true })}
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.fullname && (
              <p className="text-red-400 text-sm">Full Name is required</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="gender"
              className="text-sm font-medium text-gray-200"
            >
              Gender
            </label>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-200 flex items-center space-x-1">
                <input
                  type="radio"
                  value="Male"
                  {...register("gender", {
                    required: "Please select an option",
                  })}
                />
                <span>Male</span>
              </label>
              <label className="text-sm font-medium text-gray-200 flex items-center space-x-1">
                <input
                  type="radio"
                  value="Female"
                  {...register("gender", {
                    required: "Please select an option",
                  })}
                />
                <span>Female</span>
              </label>
            </div>
            {errors.gender && (
              <span className="font-normal italic text-red-500">
                {errors.gender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="dob" className="text-sm font-medium text-gray-200">
              Date of Birth (Optional)
            </label>
            <input
              id="dob"
              type="date"
              {...register("dob")}
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col space-y-1">
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
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">Username is required</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
              autoComplete="current-password"
              className="w-full rounded-md bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">Password is required</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-500 px-3 py-2 text-white font-semibold hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Existing User? <NavLink to="/">Click Here To Sign In</NavLink>
        </p>
      </div>
    </div>
  );
}

export default Signup;
