/* eslint-disable no-constant-condition */
import React from "react";
import BlurCircle from "../components/BlurCircle";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const Aircons = () => {
  const { products } = useAppContext();
  console.log("Rendering Aircons with products:", products); // Add this line

  return products.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="120px" right="50px" />
      <h1 className="text-lg font-medium my-4">Air Conditioners</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-10">
        {products.map((item) => (
          <ProductCard product={item} key={item._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No Products Available</h1>
    </div>
  );
};

export default Aircons;
