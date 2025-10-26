import "../App.css";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Transactions({
  transactionDetails,
  onTransactionUpdate,
  onTransactionDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [editingId, setEditingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return transactionDetails.slice(startIndex, endIndex);
  }, [transactionDetails, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(transactionDetails.length / itemsPerPage);

  // Reset to page 1 when data changes or when current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [transactionDetails.length, totalPages, currentPage]);

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

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setValue("title", transaction.title);
    setValue("amount", transaction.amount.toString());
    setValue("transactionType", transaction.transactionType);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset();
  };

  const handleDeleteClick = (transactionId) => {
    onTransactionDelete(transactionId);
  };

  const onSubmit = async (data, transactionId) => {
    setIsUpdating(true);
    try {
      const response = await axios.patch(
        `/api/v1/transactions/${transactionId}`,
        {
          title: data.title,
          amount: Number(data.amount),
          transactionType: data.transactionType,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the transaction in the parent component
        onTransactionUpdate(transactionId, {
          title: data.title,
          amount: Number(data.amount),
          transactionType: data.transactionType,
        });

        setEditingId(null);
        reset();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!transactionDetails.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No transactions yet</p>
        <p className="text-gray-400 text-sm mt-1">
          Start by adding your first transaction
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Recent Transactions
        </h3>
        {totalPages > 1 && (
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
            Page {currentPage} of {totalPages} • {transactionDetails.length}{" "}
            total
          </div>
        )}
      </div>

      <div className="space-y-3">
        {paginatedData.map((t, index) => (
          <div
            key={t._id || index}
            className={`p-5 rounded-xl shadow-md transition-all hover:shadow-lg ${
              t.transactionType === "expense"
                ? "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500"
                : "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500"
            }`}
          >
            {editingId === t._id ? (
              // Edit Mode
              <form onSubmit={handleSubmit((data) => onSubmit(data, t._id))}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter title"
                      className={`w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                        errors.title
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
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
                          message: "Title should be at least 3 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Title should be at most 100 characters",
                        },
                      })}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      min="1"
                      className={`w-full border-2 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                        errors.amount
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
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
                          message: "Amount must be greater than 0",
                        },
                      })}
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="relative">
                        <input
                          type="radio"
                          value="income"
                          {...register("transactionType", {
                            required: "Please select an option",
                          })}
                          className="peer sr-only"
                        />
                        <div className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer transition-all hover:border-green-500 peer-checked:border-green-500 peer-checked:bg-green-50">
                          <span className="text-sm font-medium text-gray-700">
                            Income
                          </span>
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
                        <div className="flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer transition-all hover:border-red-500 peer-checked:border-red-500 peer-checked:bg-red-50">
                          <span className="text-sm font-medium text-gray-700">
                            Expense
                          </span>
                        </div>
                      </label>
                    </div>
                    {errors.transactionType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.transactionType.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      {isUpdating ? "Updating..." : "✓ Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="px-6 bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      t.transactionType === "expense"
                        ? "bg-red-100"
                        : "bg-green-100"
                    }`}
                  >
                    {t.transactionType === "expense" ? (
                      <svg
                        className="w-6 h-6 text-red-600"
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
                    ) : (
                      <svg
                        className="w-6 h-6 text-green-600"
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
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{t.title}</p>
                    <span
                      className={`inline-block mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        t.transactionType === "expense"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {t.transactionType === "expense" ? "Expense" : "Income"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`text-2xl font-bold ${
                      t.transactionType === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {t.transactionType === "expense" ? "-" : "+"}$
                    {t.amount.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(t)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(t._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {transactionDetails.length > 0 && (
        <div className="flex justify-center items-center mt-8">
          {/* Navigation controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || totalPages <= 1}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === 1 || totalPages <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages <= 1}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentPage === totalPages || totalPages <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              Next
              <svg
                className="w-4 h-4 inline ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
