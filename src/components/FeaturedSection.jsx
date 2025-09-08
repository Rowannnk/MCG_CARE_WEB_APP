import React from "react";
import BlurCircle from "./BlurCircle";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { products } = useAppContext();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden ">
      {/*Title */}
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top="110px" left="-80px" />

        <p className="text-gray-600 font-bold text-lg mb-2">Hot Products</p>
        <button
          onClick={() => navigate("/aircons")}
          className="group flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
        >
          View All
          <ArrowRightIcon className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition cursor-pointer" />
        </button>
      </div>
      {/* Product Card */}
      <div className="flex flex-wrap max-sm:justify-center gap-8 mt-8 ">
        {products.slice(0, 7).map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;
