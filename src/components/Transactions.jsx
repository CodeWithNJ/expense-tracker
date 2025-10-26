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
            key={t._id || index}
            className={`p-4 rounded-md shadow-sm ${
              t.transactionType === "expense"
                ? "bg-red-100 border-l-4 border-red-500"
                : "bg-green-100 border-l-4 border-green-500"
            }`}
          >
            {editingId === t._id ? (
              // Edit Mode
              <form onSubmit={handleSubmit((data) => onSubmit(data, t._id))}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter title"
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        errors.title
                          ? "border-red-500 focus:ring-red-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      min="1"
                      className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                        errors.amount
                          ? "border-red-500 focus:ring-red-500"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="income"
                          {...register("transactionType", {
                            required: "Please select an option",
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm">Income</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="expense"
                          {...register("transactionType", {
                            required: "Please select an option",
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm">Expense</span>
                      </label>
                    </div>
                    {errors.transactionType && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.transactionType.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Done"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // View Mode
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-800">{t.title}</p>
                  <span
                    className={`inline-block mt-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      t.transactionType === "expense"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {t.transactionType === "expense" ? "Expense" : "Income"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`text-lg font-bold ${
                      t.transactionType === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {t.transactionType === "expense" ? "-" : "+"}${t.amount}
                  </p>
                  <button
                    onClick={() => handleEditClick(t)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(t._id)}
                    className="px-3 py-1 bg-red-400 text-white text-sm rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {transactionDetails.length > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          {/* Navigation controls - always show when there are transactions */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || totalPages <= 1}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 1 || totalPages <= 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
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
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages <= 1}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === totalPages || totalPages <= 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;
