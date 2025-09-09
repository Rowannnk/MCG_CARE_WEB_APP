import React, { useState, useEffect } from "react";
import Title from "../../components/admin/Title";
import {
  FiUser,
  FiMail,
  FiBook,
  FiStar,
  FiMessageSquare,
  FiCalendar,
  FiTool,
  FiFilter,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
  FiThumbsUp,
  FiAward,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import axios from "axios";
import { Mail } from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "bookings",
    direction: "desc",
  });
  const [activeTab, setActiveTab] = useState("users");
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState("");

  // Pagination state for feedbacks
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [technicianSearch, setTechnicianSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "/api/booking/admin/user-booking-count",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFeedbacks = async (page = 1, limit = 3) => {
    try {
      const response = await axios.get(
        `/api/feedback?page=${page}&limit=${limit}`
      );
      setFeedbacks(response.data.feedbacks);
      setTotalFeedbackCount(response.data.totalCount);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchFeedbacks()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchFeedbacks(newPage, itemsPerPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchFeedbacks(1, newItemsPerPage);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesTextSearch =
      feedback.userId?.name
        .toLowerCase()
        .includes(feedbackSearchTerm.toLowerCase()) ||
      feedback.userId?.email
        .toLowerCase()
        .includes(feedbackSearchTerm.toLowerCase()) ||
      (feedback.textReview &&
        feedback.textReview
          .toLowerCase()
          .includes(feedbackSearchTerm.toLowerCase()));

    const matchesTechnicianSearch =
      !technicianSearch ||
      (feedback.bookingId?.assignedTechnician?.name &&
        feedback.bookingId.assignedTechnician.name
          .toLowerCase()
          .includes(technicianSearch.toLowerCase()));

    const feedbackDate = new Date(feedback.createdAt);
    let matchesDateFilter = true;

    if (dateFilter === "today") {
      const today = new Date();
      matchesDateFilter =
        feedbackDate.getDate() === today.getDate() &&
        feedbackDate.getMonth() === today.getMonth() &&
        feedbackDate.getFullYear() === today.getFullYear();
    } else if (dateFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      matchesDateFilter = feedbackDate >= oneWeekAgo;
    } else if (dateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      matchesDateFilter = feedbackDate >= oneMonthAgo;
    } else if (dateFilter === "custom" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDateFilter = feedbackDate >= start && feedbackDate <= end;
    }

    return matchesTextSearch && matchesTechnicianSearch && matchesDateFilter;
  });

  // Render sort indicator
  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <FiArrowUp size={14} />
    ) : (
      <FiArrowDown size={14} />
    );
  };

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

  // Get badge color based on feedback metric
  const getMetricBadgeColor = (value) => {
    if (value.includes("Very")) return "bg-green-100 text-green-800";
    if (value.includes("Satisfied")) return "bg-blue-100 text-blue-800";
    if (value.includes("Professional")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  // Improved pagination component
  const ImprovedPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-white rounded-lg border border-gray-200">
        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalFeedbackCount)} of{" "}
          {totalFeedbackCount} results
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="First Page"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Previous Page"
          >
            ‹
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md border transition-colors ${
                currentPage === page
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Next Page"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Last Page"
          >
            »
          </button>
        </div>
      </div>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFeedbackSearchTerm("");
    setTechnicianSearch("");
    setDateFilter("all");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <Title text1="User" text2="Management" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Title text1="User" text2="Management" />
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title text1="User" text2="Management" />
        <div className="text-sm text-gray-600">
          {activeTab === "users"
            ? `Total: ${users.length} users`
            : `Total: ${totalFeedbackCount} feedback entries`}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "feedbacks"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("feedbacks")}
        >
          All Feedbacks
        </button>
      </div>

      {activeTab === "users" ? (
        <>
          {/* Search and Filter for Users */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiFilter className="text-gray-400" />
                <span className="text-gray-600">Sort by:</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                  value={sortConfig.key}
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="bookings">Bookings</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      User
                      {renderSortIndicator("name")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {renderSortIndicator("email")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("bookings")}
                  >
                    <div className="flex items-center">
                      Bookings
                      {renderSortIndicator("bookings")}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMail className="mr-2 text-gray-400" size={14} />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.bookings > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.bookings} booking
                          {user.bookings !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State for Users */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FiUser size={48} className="inline-block" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No users found" : "No users yet"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search query"
                    : "Users will appear here once they register"}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* All Feedbacks Tab */
        <>
          {/* Advanced Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Text Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search feedback..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={feedbackSearchTerm}
                  onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                />
              </div>

              {/* Technician Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTool className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by technician..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={technicianSearch}
                  onChange={(e) => setTechnicianSearch(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="custom">Custom Range</option>
              </select>

              {/* Items Per Page */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Show:
                </span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary w-full"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>
            </div>

            {/* Custom Date Range */}
            {dateFilter === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-3 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredFeedbacks.length} of {feedbacks.length} feedback
            entries
          </div>

          {/* Feedback Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {renderStars(feedback.rating)}
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      ({feedback.rating}/5)
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FiUser className="mr-2" />
                    <span className="font-medium">Customer:</span>
                    <span className="ml-2">
                      {feedback.userId?.name || "Unknown User"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900 flex items-center">
                    <FiMail className="mr-2 text-gray-400" size={14} />
                    {feedback.userId?.email}
                  </div>
                </div>

                {/* Feedback Metrics */}
                <div className="mb-4 space-y-2">
                  {feedback.technicianProfessionalism && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiAward className="mr-2 text-purple-500" />
                        <span>Professionalism:</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricBadgeColor(
                          feedback.technicianProfessionalism
                        )}`}
                      >
                        {feedback.technicianProfessionalism}
                      </span>
                    </div>
                  )}

                  {feedback.serviceSatisfaction && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiThumbsUp className="mr-2 text-blue-500" />
                        <span>Satisfaction:</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricBadgeColor(
                          feedback.serviceSatisfaction
                        )}`}
                      >
                        {feedback.serviceSatisfaction}
                      </span>
                    </div>
                  )}

                  {feedback.overallExperience && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <FiHeart className="mr-2 text-red-500" />
                        <span>Experience:</span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getMetricBadgeColor(
                          feedback.overallExperience
                        )}`}
                      >
                        {feedback.overallExperience}
                      </span>
                    </div>
                  )}
                </div>

                {feedback.bookingId ? (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiTool className="mr-2" />
                      <span className="font-medium">Technician:</span>
                      <span className="ml-2">
                        {feedback.bookingId.assignedTechnician?.name ||
                          "Not assigned"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiCalendar className="mr-2" />
                      <span className="font-medium">Service:</span>
                      <span className="ml-2 capitalize">
                        {feedback.bookingId.serviceType?.replace(/_/g, " ") ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                    ⚠️ Booking information not available
                  </div>
                )}

                {feedback.textReview && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiMessageSquare className="mr-2" />
                      <span className="font-medium">Review:</span>
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      "{feedback.textReview}"
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Empty State for Feedbacks */}
            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <div className="text-gray-400 mb-4">
                  <FiMessageSquare size={48} className="inline-block" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No feedback found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or clear all filters to see
                  all feedback.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Improved Pagination Controls */}
          <ImprovedPagination />
        </>
      )}
    </div>
  );
};

export default UserManagement;
