import React, { useState, useEffect } from "react";
import Title from "../../components/admin/Title";
import axios from "axios";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/booking", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / 5);
  const startIndex = (currentPage - 1) * 5;
  const endIndex = Math.min(startIndex + 5, totalItems);
  const currentBookings = bookings.slice(startIndex, endIndex);

  // Pagination functions
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getBookingStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "assigned":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "rescheduled":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getPaymentStatusStyles = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border border-green-200";
      case "pending":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status, type) => {
    switch (status) {
      case "completed":
        return "✓";
      case "paid":
        return "💰";
      case "assigned":
        return "👨‍🔧";
      case "pending":
        return type === "payment" ? "⏰" : "📋";
      case "rescheduled":
        return "🔄";
      default:
        return "•";
    }
  };

  const formatStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "Date not set";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString, timeSlot) => {
    if (!dateString && !timeSlot) return "N/A";

    const formattedDate = formatDateOnly(dateString);
    const formattedTime = timeSlot || "Time not set";

    return `${formattedTime} on ${formattedDate}`;
  };

  const formatServiceType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };
  function buddhistToGregorian(dateStr) {
    // dateStr like "2568-09-16"
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(`${year - 543}-${month}-${day}`);
  }

  if (loading) {
    return (
      <>
        <Title text1="List" text2="Bookings" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Title text1="List" text2="Bookings" />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Title text1="List" text2="Bookings" />

      {bookings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">No bookings found.</div>
        </div>
      ) : (
        <>
          <div className="max-w-6xl overflow-x-auto mt-10">
            <table className="w-full border-collapse rounded-md overflow-hidden">
              <thead>
                <tr className="bg-primary/80 text-left text-lg text-white">
                  <th className="p-4 font-medium pl-5">Customer Name</th>
                  <th className="p-4 font-medium">Service Type</th>
                  <th className="p-4 font-medium">Booking Status</th>
                  <th className="p-4 font-medium">Payment Status</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Service Fee</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light">
                {currentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-primary/20 bg-primary/5 even:bg-primary/10 hover:bg-primary/15 transition-colors"
                  >
                    <td className="p-4 min-w-45 pl-5">
                      {booking.contactInfo?.name || "N/A"}
                    </td>
                    <td className="p-4">
                      {formatServiceType(booking.serviceType)}
                    </td>
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBookingStatusStyles(
                          booking.status
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(booking.status, "booking")}
                        </span>
                        {formatStatusText(booking.status || "pending")}
                      </div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusStyles(
                          booking.paymentStatus
                        )}`}
                      >
                        <span className="mr-1">
                          {getStatusIcon(booking.paymentStatus, "payment")}
                        </span>
                        {formatStatusText(booking.paymentStatus || "pending")}
                      </div>
                    </td>
                    <td className="p-4">
                      {formatDateTime(
                        buddhistToGregorian(booking.date),
                        booking.timeSlot
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      MMK {booking.serviceFee || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Bottom */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-w-6xl">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  title="First Page"
                >
                  <FiChevronsLeft size={16} />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  title="Previous Page"
                >
                  <FiChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded border text-sm ${
                      currentPage === page
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  title="Next Page"
                >
                  <FiChevronRight size={16} />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  title="Last Page"
                >
                  <FiChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ListBooking;
