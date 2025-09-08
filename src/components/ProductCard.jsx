import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const defaultImage =
    "https://colthomeservices.com/wp-content/uploads/2022/11/Wall-Mounted-AC-Unit.jpg";
  const imageSrc = product?.images?.[0] || defaultImage;
  return (
    <div className="flex flex-col justify-between p-4 bg-white rounded-xl hover:-translate-y-1 transition duration-300 w-66 shadow-md hover:shadow-lg border border-gray-100">
      <img
        onClick={() => {
          navigate(`/aircons/${product._id}`);
          scrollTo(0, 0);
        }}
        src={imageSrc}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer hover:opacity-90 transition-opacity"
      />
      <div className="mt-3">
        <p className="font-semibold text-lg truncate text-gray-800">
          {product.name}
        </p>

        <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 space-y-1">
          <p className="flex items-center gap-2">
            ❄️ <span>Capacity: {product.specs.capacity}</span>
          </p>
          <p className="flex items-center gap-2">
            ⚙️ <span>Type: {product.specs.type}</span>
          </p>
          <p className="flex items-center gap-2">
            🛡️ <span>Warranty: {product.specs.warranty}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pb-1">
        <button
          onClick={() => {
            navigate(`/aircons/${product._id}`);
            scrollTo(0, 0);
          }}
          className="bg-primary hover:bg-red-700 text-white rounded-lg font-medium cursor-pointer px-4 py-2 text-sm transition duration-200 shadow-md hover:shadow-red-200"
        >
          Buy Now
        </button>
        <p className="text-red-600 text-sm p-2 rounded-full bg-red-50">
          THB {product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
