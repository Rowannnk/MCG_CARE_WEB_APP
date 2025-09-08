import React, { useState } from "react";
import { Edit, Trash2, X, Save } from "lucide-react";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{productName}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    ...product,
    name: product.name || product.title || "",
    description: product.description || product.overview || "",
  });
  const [imagePreviews, setImagePreviews] = useState(product.images || []);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("specs.")) {
      const specField = name.split(".")[1];
      setEditedProduct((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value,
        },
      }));
    } else {
      setEditedProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (index >= product.images.length) {
      const newIndex = index - product.images.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // Append updated product data
      formData.append("name", editedProduct.name);
      formData.append("brand", editedProduct.brand);
      formData.append("productModel", editedProduct.specs?.type || "");
      formData.append("description", editedProduct.description);
      formData.append("tagline", editedProduct.tagline || "");
      formData.append("price", editedProduct.price);
      formData.append("stock", editedProduct.stock);

      // Handle specs - append each spec field individually
      if (editedProduct.specs) {
        Object.entries(editedProduct.specs).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(`specs[${key}]`, value);
          }
        });
      }

      // Append new images
      newImages.forEach((file) => {
        formData.append("images", file);
      });

      // Use PATCH instead of PUT to match your backend
      const endpoint = `/api/product/${product._id}`;

      console.log("Updating product at:", endpoint);

      const res = await axios.patch(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (onUpdate) {
        onUpdate(product._id, res.data);
      }

      setIsEditing(false);
      setNewImages([]);
      setError("");
    } catch (error) {
      console.error("Error updating product:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update product. Please check the form data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const endpoint = `/api/product/${product._id}`;

      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (onDelete) {
        onDelete(product._id);
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditedProduct({
      ...product,
      name: product.name || product.title || "",
      description: product.description || product.overview || "",
    });
    setImagePreviews(product.images || []);
    setNewImages([]);
    setIsEditing(false);
    setError("");
  };

  return (
    <>
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        productName={product.name || product.title}
      />

      <div className="w-64 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-sm">{error}</div>
        )}

        {/* Product Image */}
        <div className="h-48 relative">
          {isEditing ? (
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Preview ${index}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full text-sm"
                accept="image/*"
              />
            </div>
          ) : (
            <img
              src={product.images?.[0] || "/placeholder-image.jpg"}
              alt={product.name || product.title}
              className="w-full h-full object-contain p-4"
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
              {product.specs?.type || "N/A"}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {isEditing ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Product Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={editedProduct.brand || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brand"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editedProduct.description || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (THB)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editedProduct.stock || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Stock"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    name="specs.capacity"
                    value={editedProduct.specs?.capacity || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Capacity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="specs.type"
                    value={editedProduct.specs?.type || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Split">Split</option>
                    <option value="Portable">Portable</option>
                    <option value="Window">Window</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Rating
                  </label>
                  <input
                    type="text"
                    name="specs.energy_rating"
                    value={editedProduct.specs?.energy_rating || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Energy Rating"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cooling Power
                  </label>
                  <input
                    type="text"
                    name="specs.cooling_power"
                    value={editedProduct.specs?.cooling_power || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cooling Power"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Refrigerant
                  </label>
                  <input
                    type="text"
                    name="specs.refrigerant"
                    value={editedProduct.specs?.refrigerant || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Refrigerant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Warranty
                  </label>
                  <input
                    type="text"
                    name="specs.warranty"
                    value={editedProduct.specs?.warranty || ""}
                    onChange={handleInputChange}
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Warranty"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-lg truncate">
                {product.name || product.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{product.brand}</p>

              <div className="mt-3 flex justify-between items-center">
                <span className="font-bold">THB {product.price || "N/A"}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : "Out of stock"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Admin Actions */}
        <div className="border-t border-gray-100 p-3 flex justify-between">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 flex items-center"
              >
                {isLoading ? "Saving..." : <Save className="w-5 h-5" />}
              </button>
              <button
                onClick={cancelEdit}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminProductCard;
