import { useState } from "react";
import "./App.css";
import Transactions from "./components/Transactions";

function App() {
  const [formData, setFormdata] = useState({
    title: "",
    amount: 0,
    income: false,
    expense: false,
  });
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const updateTransactionType = (formData, event) => {
    if (event.target.value === "income") {
      formData.income = true;
      formData.expense = false;
    } else {
      formData.income = false;
      formData.expense = true;
    }
  };

  const updateExpenseDetails = (formData) => {
    if (!formData.title || !formData.amount) return;

    setBalance(balance + Number(formData.amount));
    if (formData.expense) {
      setTotalExpense(totalExpense + Number(formData.amount));
      setBalance(balance - Number(formData.amount));
    } else {
      setTotalIncome(totalIncome + Number(formData.amount));
      setBalance(balance + Number(formData.amount));
    }
    setHistory([...history, formData]);

    // Reset form
    setFormdata({
      title: "",
      amount: 0,
      income: false,
      expense: false,
    });
  };

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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateExpenseDetails(formData);
            }}
            className="space-y-6"
          >
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
                value={formData.title}
                onChange={(e) =>
                  setFormdata({ ...formData, title: e.target.value })
                }
                placeholder="Enter title"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
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
                type="number"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormdata({ ...formData, amount: Number(e.target.value) })
                }
                placeholder="Enter amount"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="transactionType"
                  value="income"
                  onChange={(e) => updateTransactionType(formData, e)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
                Income
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="transactionType"
                  value="expense"
                  onChange={(e) => updateTransactionType(formData, e)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500"
                />
                Expense
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 shadow-sm font-medium"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
