import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import Transactions from "./Transactions";
import axios from "axios";

function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [history, setHistory] = useState([]);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [username, setUsername] = useState("");

  // Fetch username from user details.
  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await axios.get("/api/v1/auth/user-details", {
          withCredentials: true,
        });
        setUsername(response.data.data.fullName);
      } catch (error) {
        console.error(`Error occured while fetching user details: ${error}`);
      }
    }
    fetchUsername();
  }, []);

  // Calculate balance, income, and expense from history (single source of truth)
  const { balance, totalIncome, totalExpense } = useMemo(() => {
    return history.reduce(
      (acc, transaction) => {
        if (transaction.transactionType === "income") {
          acc.balance += transaction.amount;
          acc.totalIncome += transaction.amount;
        } else {
          acc.balance -= transaction.amount;
          acc.totalExpense += transaction.amount;
        }
        return acc;
      },
      { balance: 0, totalIncome: 0, totalExpense: 0 }
    );
  }, [history]);

  useEffect(() => {
    async function fetchAllTransactions() {
      try {
        let allTransactions = [];
        let currentPage = 1;
        let hasMorePages = true;

        // Fetch all pages of transactions
        while (hasMorePages) {
          const response = await axios.get(
            `/api/v1/transactions/all?page=${currentPage}&limit=100`, // Get more items per page to reduce API calls
            {},
            { withCredentials: true } // using cookies
          );

          const pageData = response.data.data;
          allTransactions = [...allTransactions, ...pageData.docs];

          // Check if there are more pages
          hasMorePages = pageData.hasNextPage;
          currentPage++;
        }

        setHistory(allTransactions);
      } catch (error) {
        console.error(`Unable to fetch all transactions: ${error}`);
      }
    }

    fetchAllTransactions();
  }, []);

  // Auto-clear success and error messages after 5 seconds
  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => setServerSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [serverSuccess]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => setServerError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const onSubmit = async (data) => {
    reset();
    setServerError("");
    try {
      const response = await axios.post(
        "/api/v1/transactions",
        {
          title: data.title,
          amount: data.amount,
          transactionType: data.transactionType,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setServerSuccess(response.data.message);
        const transaction = response.data.data;
        // Simply add to history - totals will be recalculated automatically
        setHistory((prev) => [...prev, transaction]);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  const handleTransactionUpdate = (transactionId, updatedData) => {
    // Simply update the transaction in history - totals will be recalculated automatically
    setHistory((prev) =>
      prev.map((t) => (t._id === transactionId ? { ...t, ...updatedData } : t))
    );
    setServerSuccess("Transaction updated successfully!");
  };

  const handleTransactionDelete = async (transactionId) => {
    try {
      await axios.delete(`/api/v1/transactions/${transactionId}`, {
        withCredentials: true,
      });
      // Simply remove from history - totals will be recalculated automatically
      setHistory((prev) => prev.filter((p) => p._id !== transactionId));
      setServerSuccess("Transaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setServerError("Failed to delete transaction. Please refresh the page.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl mb-8 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6"
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
              <span className="text-2xl font-bold tracking-tight">
                Expense Tracker
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium">{username}</span>
              </div>
              {/* Logout Button */}
              <button
                type="button"
                className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg shadow hover:shadow-md hover:bg-purple-50 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-100 font-medium">Total Balance</h3>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          </div>

          {/* Income Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-100 font-medium">Income</h3>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">
              +${totalIncome.toLocaleString()}
            </p>
          </div>

          {/* Expense Card */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform transition-transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-red-100 font-medium">Expense</h3>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">
              -${totalExpense.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <Transactions
            transactionDetails={history}
            onTransactionUpdate={handleTransactionUpdate}
            onTransactionDelete={handleTransactionDelete}
          />
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">
              Add New Transaction
            </h4>
            <p className="text-gray-500 text-sm">
              Track your income and expenses
            </p>
          </div>

          {/* Messages */}
          {serverError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-600 text-sm font-medium">{serverError}</p>
            </div>
          )}
          {serverSuccess && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <p className="text-green-600 text-sm font-medium">
                {serverSuccess}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Transaction Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="e.g., Grocery Shopping, Salary, etc."
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                {...register("title", {
                  required: {
                    value: true,
                    message: "Title cannot be empty",
                  },
                  pattern: {
                    value: /^(?!^\d+$)[a-zA-Z0-9\s]+$/,
                    message: "Invalid Title",
                  },
                  minLength: {
                    value: 3,
                    message: "Title should be of atleast 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title should be of atmost 100 characters",
                  },
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <label
                htmlFor="amount"
                className="block text-gray-700 font-semibold mb-2 text-sm"
              >
                Amount ($)
              </label>
              <input
                id="amount"
                type="text"
                placeholder="Enter amount in dollars"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                {...register("amount", {
                  required: {
                    value: true,
                    message: "Amount cannot be empty",
                  },
                  pattern: {
                    value: /^\d+$/,
                    message: "Invalid Amount",
                  },
                  min: {
                    value: 1,
                    message: "Amount value cannot be less than 1",
                  },
                })}
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative">
                  <input
                    type="radio"
                    value="income"
                    {...register("transactionType", {
                      required: "Please select an option",
                    })}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-green-500 peer-checked:border-green-500 peer-checked:bg-green-50">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">Income</span>
                    </div>
                  </div>
                </label>
                <label className="relative">
                  <input
                    type="radio"
                    value="expense"
                    {...register("transactionType", {
                      required: "Please select an option",
                    })}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-red-500 peer-checked:border-red-500 peer-checked:bg-red-50">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-red-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                      </svg>
                      <span className="text-gray-700 font-medium">Expense</span>
                    </div>
                  </div>
                </label>
              </div>
              {errors.transactionType && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.transactionType.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transform transition-transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
