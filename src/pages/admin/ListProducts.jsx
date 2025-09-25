import React, { useState } from "react";
import Title from "../../components/admin/Title";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiTag,
  FiBox,
  FiDollarSign,
  FiInfo,
  FiCalendar,
  FiStar,
} from "react-icons/fi";
import { useAppContext } from "../../context/AppContext";

const ListProducts = () => {
  const { products, loading } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = async (productId) => {
    setIsModalOpen(true);
    setModalLoading(true);

    try {
      const response = await fetch(
        `https://backend-zeta-pied-49.vercel.app/api/product/${productId}`
      );
      const data = await response.json();
      setSelectedProduct(data);
    } catch (err) {
      console.error("Failed to fetch product", err);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

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

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
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
                    className="border-b border-primary/30 bg-primary/5 even:bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer"
                    onClick={() => openModal(product._id)}
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

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-md bg-black/40">
              <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-200">
                <div className="sticky top-0 flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <FiBox className="text-primary" /> Product Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="px-6 py-6 space-y-4 text-gray-800">
                  {modalLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : selectedProduct ? (
                    <>
                      {/* Images */}
                      {selectedProduct.images?.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {selectedProduct.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={selectedProduct.name}
                              className="w-full h-32 object-contain rounded-lg border"
                            />
                          ))}
                        </div>
                      )}

                      {/* Basic info */}
                      <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                        <FiTag className="text-purple-500" />
                        <p className="font-medium">
                          Name: {selectedProduct.name}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                        <FiBox className="text-blue-500" />
                        <p className="font-medium">
                          Brand: {selectedProduct.brand}
                        </p>
                      </div>
                      {selectedProduct.productModel && (
                        <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                          <FiInfo className="text-orange-500" />
                          <p className="font-medium">
                            Model: {selectedProduct.productModel}
                          </p>
                        </div>
                      )}
                      {selectedProduct.description && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium">
                            Description: {selectedProduct.description}
                          </p>
                        </div>
                      )}

                      {/* Specs */}
                      {selectedProduct.specs && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-1">
                          {Object.entries(selectedProduct.specs).map(
                            ([key, value]) =>
                              value && (
                                <p key={key}>
                                  <span className="font-medium capitalize">
                                    {key.replace("_", " ")}:
                                  </span>{" "}
                                  {value}
                                </p>
                              )
                          )}
                        </div>
                      )}

                      {selectedProduct.release_date && (
                        <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                          <FiCalendar className="text-indigo-500" />
                          <p className="font-medium">
                            Release Date:{" "}
                            {new Date(
                              selectedProduct.release_date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {selectedProduct.tagline && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium">
                            Tagline: {selectedProduct.tagline}
                          </p>
                        </div>
                      )}

                      <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                        <FiDollarSign className="text-green-500" />
                        <p className="font-medium">
                          Price: THB {selectedProduct.price}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                        <FiStar className="text-yellow-400" />
                        <p className="font-medium">
                          Vote: {selectedProduct.vote_average || 0} (
                          {selectedProduct.vote_count || 0} votes)
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                        <FiBox
                          className={`${
                            selectedProduct.stock > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        />
                        <p className="font-medium">
                          Stock:{" "}
                          {selectedProduct.stock > 0
                            ? `${selectedProduct.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Failed to load product details.
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 flex justify-end items-center px-6 py-4 bg-white border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 rounded-full bg-primary text-white font-medium hover:opacity-90"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ListProducts;
