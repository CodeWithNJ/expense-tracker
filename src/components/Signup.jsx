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

  const inputClass =
    "w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm";
  const labelClass = "block text-gray-700 font-semibold mb-1.5 text-sm";

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-4 sm:px-6">
      <div className="w-full max-w-lg flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6">
          {/* Compact header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <svg
                className="w-5 h-5 text-white"
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
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                Expense Tracker
              </h1>
              <p className="text-gray-500 text-xs">Create your account</p>
            </div>
          </div>

          {serverError && (
            <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-600 text-xs font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="fullname" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Full name"
                  {...register("fullname", { required: true })}
                  className={inputClass}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs mt-0.5">Required</p>
                )}
              </div>
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  {...register("username", { required: true })}
                  className={inputClass}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-0.5">Required</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="relative">
                    <input
                      type="radio"
                      value="Male"
                      {...register("gender", {
                        required: "Please select an option",
                      })}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center py-2 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-purple-500 peer-checked:border-purple-500 peer-checked:bg-purple-50 text-sm font-medium text-gray-700">
                      Male
                    </div>
                  </label>
                  <label className="relative">
                    <input
                      type="radio"
                      value="Female"
                      {...register("gender", {
                        required: "Please select an option",
                      })}
                      className="peer sr-only"
                    />
                    <div className="flex items-center justify-center py-2 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-purple-500 peer-checked:border-purple-500 peer-checked:bg-purple-50 text-sm font-medium text-gray-700">
                      Female
                    </div>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="dob" className={labelClass}>
                  Date of Birth{" "}
                  <span className="text-gray-400 font-normal">(opt.)</span>
                </label>
                <input
                  id="dob"
                  type="date"
                  {...register("dob")}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                  autoComplete="new-password"
                  className={inputClass}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-0.5">Required</p>
                )}
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transform transition-transform hover:scale-[1.02] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm"
                >
                  Create account
                </button>
              </div>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <NavLink
              to="/"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
