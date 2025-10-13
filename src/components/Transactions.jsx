import "../App.css";
import { useState, useMemo } from "react";

function Transactions({ transactionDetails }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactionDetails.slice(startIndex, endIndex);
  }, [transactionDetails, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(transactionDetails.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!transactionDetails.length) {
    return (
      <div className="text-center text-gray-400 italic">
        No transactions added yet.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-center">Transactions</h3>
        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({transactionDetails.length}{" "}
            total)
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedData.map((t, index) => (
          <div
            key={index}
            className={`flex justify-between items-center p-4 rounded-md shadow-sm ${
              t.transactionType === "expense"
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
                {t.transactionType === "expense" ? "Expense" : "Income"}
              </span>
            </div>
            <p
              className={`text-lg font-bold ${
                t.transactionType === "expense"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {t.transactionType === "expense" ? "-" : "+"}${t.amount}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Transactions;
