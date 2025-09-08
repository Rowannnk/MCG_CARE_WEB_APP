/* eslint-disable no-constant-condition */
import React from "react";
import BlurCircle from "../components/BlurCircle";
import { dummyACProducts } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const Favorite = () => {
  return true ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="100px" right="50px" />
      <h1 className="text-lg font-bold my-4">Your Favorite Products</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-10">
        {dummyACProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">No Favorite Right Now</h1>
    </div>
  );
};

export default Favorite;
