/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import Title from "../../components/admin/Title";
import AdminProductCard from "../../components/admin/AdminProductCard";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "✓" : "✕";

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-md shadow-lg flex items-center space-x-2 transition-all duration-300 z-50`}
    >
      <span className="text-lg font-bold">{icon}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        ×
      </button>
    </div>
  );
};

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    brand: "",
    productModel: "",
    specs: {
      capacity: "",
      type: "",
      energy_rating: "",
      cooling_power: "",
      refrigerant: "",
      warranty: "",
    },
    price: "",
    stock: "",
    tagline: "",
    release_date: "",
    vote_count: 0,
    vote_average: 0,
  });

  const fileInputRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const { products, fetchProducts } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("specs.")) {
      const specField = name.split(".")[1];
      setProductData((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specField]: value,
        },
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("brand", productData.brand);
      formData.append("productModel", productData.productModel); // fixed
      formData.append("description", productData.description);
      formData.append("tagline", productData.tagline || "");
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("vote_count", productData.vote_count);
      formData.append("vote_average", productData.vote_average);
      formData.append("specs", JSON.stringify(productData.specs));

      if (productData.release_date) {
        formData.append("release_date", productData.release_date);
      }

      selectedFiles.forEach((file) => formData.append("images", file));

      await axios.post("/api/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      showToast("Product created successfully!");

      setProductData({
        name: "",
        description: "",
        brand: "",
        productModel: "",
        specs: {
          capacity: "",
          type: "",
          energy_rating: "",
          cooling_power: "",
          refrigerant: "",
          warranty: "",
        },
        price: "",
        stock: "",
        tagline: "",
        release_date: "",
        vote_count: 0,
        vote_average: 0,
      });
      setPreviewImages([]);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);

      showToast(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    }
  };

  const handleProductUpdate = (productId, updatedProduct) => {
    showToast("Product updated successfully!");
    fetchProducts(); // Refresh the product list
    // Or update the specific product in state if you prefer
  };

  const handleProductDelete = (productId) => {
    showToast("Product deleted successfully!");
    fetchProducts(); // Refresh the product list
  };

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const brands = ["All", "MCG", "Chigo", "Daikin", "Aufit"];

  // Filter products by selected brand
  const filteredProducts =
    selectedBrand === "All"
      ? products
      : products.filter((p) => p.brand === selectedBrand);

  const visibleCount = showAll ? filteredProducts.length : 8;

  return (
    <div className="p-6">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <Title text1="Add" text2="Products" />

      <div className="mt-10 ">
        <div className="mt-10 flex items-center justify-between max-w-6xl mb-5">
          <h2 className="text-lg font-medium">Our Products</h2>
          {filteredProducts.length > 8 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-red-600 cursor-pointer underline hover:text-red-400 transition-all duration-200"
            >
              {showAll ? "Show Less" : "See All"}
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-4 flex-wrap">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => {
                setSelectedBrand(brand);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-md border ${
                selectedBrand === brand
                  ? "bg-red-600 text-white"
                  : " text-black hover:bg-gray-100"
              } transition`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-4 mt-4">
        <div className="flex flex-wrap max-sm:justify-center gap-10 items-start">
          {filteredProducts.slice(0, visibleCount).map((item) => (
            <AdminProductCard
              product={item}
              key={item._id}
              onUpdate={handleProductUpdate}
              onDelete={handleProductDelete}
            />
          ))}
        </div>
      </div>

      {/* Add Product Form */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Add New Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={productData.brand}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Product Model
              </label>
              <input
                type="text"
                name="productModel"
                value={productData.productModel}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={productData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Overview</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md min-h-[100px] focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Improved Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Images
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              multiple
            />

            <div className="flex flex-col gap-4">
              {/* Preview Area */}
              {previewImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Image Previews:</p>
                  <div className="flex flex-wrap gap-3">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <p className="text-sm text-gray-600">
                    {previewImages.length > 0
                      ? "Click to add more images"
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerFileInput}
                className="self-start px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Choose Images
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Capacity
                </label>
                <input
                  type="text"
                  name="specs.capacity"
                  value={productData.specs.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  name="specs.type"
                  value={productData.specs.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Non-Inverter Floor Standing Type">
                    Non-Inverter Floor Standing Type
                  </option>
                  <option value="Non-Inverter Split Type">
                    Non-Inverter Split Type
                  </option>
                  <option value="Inverter Split Type">
                    {" "}
                    Inverter Split Type
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Energy Rating
                </label>
                <input
                  type="text"
                  name="specs.energy_rating"
                  value={productData.specs.energy_rating}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cooling Power
                </label>
                <input
                  type="text"
                  name="specs.cooling_power"
                  value={productData.specs.cooling_power}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Refrigerant
                </label>
                <input
                  type="text"
                  name="specs.refrigerant"
                  value={productData.specs.refrigerant}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  name="specs.warranty"
                  value={productData.specs.warranty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vote Count
                </label>
                <input
                  type="number"
                  name="vote_count"
                  min={0}
                  value={productData.vote_count}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vote Average
                </label>
                <input
                  type="number"
                  name="vote_average"
                  min={0}
                  max={5}
                  step={0.1}
                  value={productData.vote_average}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  name="release_date"
                  value={productData.release_date}
                  onChange={handleChange}
                  placeholder="2025-04-28"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (MMK)
              </label>
              <div className="inline-flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md w-full focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                <p className="text-gray-400 text-sm">MMK</p>
                <input
                  type="number"
                  name="price"
                  min={0}
                  value={productData.price}
                  onChange={handleChange}
                  className="outline-none w-full"
                  placeholder="Enter Product Price"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                min={0}
                value={productData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
