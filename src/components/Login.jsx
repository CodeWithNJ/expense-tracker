import { useForm } from "react-hook-form";
import { NavLink, Outlet } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            EXPENSE TRACKER
          </h2>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Sign in to your account
          </h2>

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

            {/* Password Field */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-200"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Forgot password?
                </a>
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
      <Outlet />
    </>
  );
}

export default Login;
