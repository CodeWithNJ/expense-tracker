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
    <div className="min-h-screen flex items-center justify-center  bg-gray-900 px-4 py-10">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-amber-800">
          Expense Tracker
        </h1>

        <div className="rounded-md p-4 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700">Balance</h3>
            <p className="text-2xl font-bold text-gray-800">${balance}</p>
          </div>
          <div className="flex justify-between gap-6">
            <div className="text-green-700 text-center">
              <h4 className="font-semibold">Income</h4>
              <p>${totalIncome}</p>
            </div>
            <div className="text-red-700 text-center">
              <h4 className="font-semibold">Expense</h4>
              <p>{totalExpense === 0 ? "$0" : `-$${totalExpense}`}</p>
            </div>
          </div>
        </div>

        <Transactions
          transactionDetails={history}
          onTransactionUpdate={handleTransactionUpdate}
          onTransactionDelete={handleTransactionDelete}
        />

        <div>
          <h4 className="text-2xl font-semibold text-center mb-6">
            Add New Transaction
          </h4>
          {serverError && (
            <p className="mb-4 text-red-400 text-sm text-center">
              {serverError}
            </p>
          )}
          {serverSuccess && (
            <p className="mb-4 text-green-500 text-sm text-center">
              {serverSuccess}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <p className="font-medium italic text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-gray-700 font-medium mb-2"
              >
                Amount
              </label>
              <input
                id="amount"
                type="text"
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <p className="font-medium italic text-red-500">
                  {errors.amount.message}
                </p>
              )}
            </div>
            <label htmlFor="income">
              <input
                type="radio"
                value="income"
                {...register("transactionType", {
                  required: "Please select an option",
                })}
              />
              Income
            </label>
            <label htmlFor="expense">
              <input
                type="radio"
                value="expense"
                {...register("transactionType", {
                  required: "Please select an option",
                })}
              />
              Expense
            </label>
            {errors.transactionType && (
              <span className="font-medium italic text-red-500">
                {errors.transactionType.message}
              </span>
            )}
            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
