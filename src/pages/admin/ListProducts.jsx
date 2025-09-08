import React, { useState } from "react";
import Title from "../../components/admin/Title";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const ListProducts = () => {
  const { products, loading } = useAppContext();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return (
      <>
        <Title text1="List" text2="Products" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  // Calculate pagination values
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentProducts = products.slice(startIndex, endIndex);

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

  return (
    <>
      <Title text1="List" text2="Products" />

      {products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">No products found.</div>
        </div>
      ) : (
        <>
          <div className="max-w-6xl mt-6 overflow-x-auto">
            <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
              <thead>
                <tr className="bg-primary/80 text-left text-lg text-white">
                  <th className="p-4 font-medium pl-5">Product Name</th>
                  <th className="p-4 font-medium">Brand</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Warranty</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light">
                {currentProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-primary/30 bg-primary/5 even:bg-primary/10 hover:bg-primary/15 transition-colors"
                  >
                    <td className="p-4 min-w-45 pl-5">
                      {product.name || product.title}
                    </td>
                    <td className="p-4">{product.brand}</td>
                    <td className="p-4">{product.specs?.type || "N/A"}</td>
                    <td className="p-4">THB {product.price}</td>
                    <td
                      className={`p-4 ${
                        product.stock > 0 ? "text-green-500" : "text-primary"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </td>
                    <td className="p-4">{product.specs?.warranty || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls - Bottom */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-w-6xl">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
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

export default ListProducts;
