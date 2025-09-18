import React, { useState, useEffect } from "react";
import Title from "../../components/admin/Title";
import axios from "axios";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiSearch,
  FiFilter,
  FiStar,
  FiMessageSquare,
  FiTool,
  FiThumbsUp,
  FiAward,
  FiCheck,
  FiX,
} from "react-icons/fi";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const CustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/feedback?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFeedbacks(response.data.feedbacks || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalCount || 0);
      setError("");
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Failed to load feedbacks. Please try again.");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

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

  // Filter feedbacks based on search and filter criteria
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userId?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.assignedTechnicianId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      feedback.textReview?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTechnician =
      !technicianFilter ||
      feedback.assignedTechnicianId?.name
        ?.toLowerCase()
        .includes(technicianFilter.toLowerCase());

    const matchesRating =
      !ratingFilter || feedback.rating?.toString() === ratingFilter;

    return matchesSearch && matchesTechnician && matchesRating;
  });

  // Render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`inline-block ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
        size={16}
      />
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Get badge color based on feedback metric
  const getMetricBadgeColor = (value) => {
    if (value.includes("Very")) return "bg-green-100 text-green-800";
    if (value.includes("Satisfied")) return "bg-blue-100 text-blue-800";
    if (value.includes("Professional")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setTechnicianFilter("");
    setRatingFilter("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <Title text1="Customer" text2="Feedbacks" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Title text1="Customer" text2="Feedbacks" />
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title text1="Customer" text2="Feedbacks" />
        <div className="text-sm text-gray-600">
          Total: {totalItems} feedback entries
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by customer, technician, or review..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Technician Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiTool className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filter by technician..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
            />
          </div>

          {/* Rating Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiStar className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || technicianFilter || ratingFilter) && (
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">
            {feedbacks.length === 0
              ? "No feedbacks found."
              : "No feedbacks match your filters."}
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl overflow-x-auto mt-4">
            <table className="w-full border-collapse rounded-md overflow-hidden">
              <thead>
                <tr className="bg-primary/80 text-left text-white">
                  <th className="p-4 font-medium pl-5">Customer</th>
                  <th className="p-4 font-medium">Technician</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Professionalism</th>
                  <th className="p-4 font-medium">Satisfaction</th>
                  <th className="p-4 font-medium">Issue Resolved</th>
                  <th className="p-4 font-medium">Review</th>
                  <th className="p-4 font-medium">Submitted On</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light">
                {filteredFeedbacks.map((feedback) => (
                  <tr
                    key={feedback._id}
                    className="border-b border-primary/20 bg-primary/5 even:bg-primary/10 hover:bg-primary/15 transition-colors"
                  >
                    <td className="p-4 pl-5">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {feedback.userId?.name || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {feedback.userId?.email || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {feedback.assignedTechnicianId?.name ||
                            "Not assigned"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {feedback.assignedTechnicianId?.email || ""}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        {renderStars(feedback.rating)}
                        <span className="ml-2 text-sm font-medium">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {feedback.technicianProfessionalism ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricBadgeColor(
                            feedback.technicianProfessionalism
                          )}`}
                        >
                          {feedback.technicianProfessionalism}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      {feedback.serviceSatisfaction ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricBadgeColor(
                            feedback.serviceSatisfaction
                          )}`}
                        >
                          {feedback.serviceSatisfaction}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-4">
                      {feedback.issueResolved ? (
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            feedback.issueResolved === "Yes"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {feedback.issueResolved === "Yes" ? (
                            <FiCheck className="mr-1" size={12} />
                          ) : (
                            <FiX className="mr-1" size={12} />
                          )}
                          {feedback.issueResolved}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="p-4 max-w-md">
                      {feedback.textReview ? (
                        <div className="flex items-start">
                          <p className="text-gray-700 line-clamp-2">
                            {feedback.textReview}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">No review</span>
                      )}
                    </td>
                    <td className="p-4">{formatDate(feedback.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Bottom */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-w-7xl">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {startIndex} to {endIndex} of {totalItems} entries
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
    </div>
  );
};

export default CustomerFeedback;
