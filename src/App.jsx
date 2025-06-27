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
  let [balance, setBalance] = useState(0);
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
    setBalance(balance + Number(formData.amount));
    if (formData.expense) {
      setTotalExpense(totalExpense + Number(formData.amount));
      setBalance(balance - Number(formData.amount));
    } else {
      setTotalIncome(totalIncome + Number(formData.amount));
      setBalance(balance + Number(formData.amount));
    }
    setHistory([...history, formData]);
  };

  return (
    <>
      <div className="main-container">
        <h1 className="title">Expense Tracker</h1>
        <div id="showBalance">
          <h3>Your Balance</h3>
          <p>{balance}$</p>
        </div>
        <div id="incomeAndExpenseDisplay">
          <div id="income">
            <h4>Income</h4>
            <p id="incomeValue">{totalIncome}$</p>
          </div>
          <div id="expense">
            <h4>Expense</h4>
            <p id="expenseValue">
              {totalExpense === 0 ? totalExpense : -totalExpense}$
            </p>
          </div>
        </div>
        <Transactions transactionDetails={history} />
        <div id="newTransaction">
          <h4>Add New Transaction</h4>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            onChange={(e) =>
              setFormdata({ ...formData, title: e.target.value })
            }
            placeholder="Enter title"
          />
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="text"
            onChange={(e) =>
              setFormdata({
                ...formData,
                amount: Number(e.target.value),
              })
            }
            placeholder="Enter amount"
          />
          <div>
            <input
              type="radio"
              id="incomeType"
              name="transactionType"
              onChange={(e) => updateTransactionType(formData, e)}
              value="income"
            />
            <label htmlFor="incomeType">Income</label>
            <br></br>
            <input
              type="radio"
              id="expenseType"
              name="transactionType"
              onChange={(e) => updateTransactionType(formData, e)}
              value="expense"
            />
            <label htmlFor="expenseType">Expense</label>
            <button
              type="submit"
              onClick={() => updateExpenseDetails(formData)}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
