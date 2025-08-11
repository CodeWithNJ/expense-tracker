import { useState } from "react";
import { useForm } from "react-hook-form";
import "./App.css";
import Transactions from "./components/Transactions";

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  function onSubmit(data) {
    if (data.transactionType === "income") {
      setBalance(balance + Number(data.amount));
      setTotalIncome(totalIncome + Number(data.amount));
    } else {
      setBalance(balance - Number(data.amount));
      setTotalExpense(totalExpense + Number(data.amount));
    }
    setHistory([...history, data]);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
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

        <Transactions transactionDetails={history} />

        <div>
          <h4 className="text-2xl font-semibold text-center mb-6">
            Add New Transaction
          </h4>
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
                    value: /^[A-Za-z]+$/i,
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

export default App;
