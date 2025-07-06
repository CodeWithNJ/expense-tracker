import "../App.css";

function Transactions({ transactionDetails }) {
  if (!transactionDetails.length) {
    return (
      <div className="text-center text-gray-400 italic">
        No transactions added yet.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-center">Transactions</h3>
      <div className="space-y-4">
        {transactionDetails.map((t, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 rounded-md shadow-sm ${
              t.expense
                ? "bg-red-100 border-l-4 border-red-500"
                : "bg-green-100 border-l-4 border-green-500"
            }`}
          >
            <div>
              <p className="text-lg font-medium text-gray-800">{t.title}</p>
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  t.expense
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {t.expense ? "Expense" : "Income"}
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                t.expense ? "text-red-600" : "text-green-600"
              }`}
            >
              {t.expense ? "-" : "+"}${t.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;
