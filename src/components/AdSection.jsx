import React from "react";
import BlurCircle from "./BlurCircle";
import { dummyAds } from "../assets/assets";

const AdSection = () => {
  return (
    <div className="mt-36 px-4 md:px-16 lg:px-24 xl:px-44 overflow-hidden h-120">
      {/* Title */}
      <div className="relative mb-12">
        <BlurCircle top="100px" right="-80px" />

        <p className="text-gray-600 font-bold text-lg mb-2">What's Coming?</p>
      </div>

      {/* AD Cards */}
      <div className="mt-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12 ">
        {dummyAds.map((ad, index) => (
          <div
            key={index}
            className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="aspect-w-16 aspect-h-9 overflow-hidden">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <div className="flex flex-row items-end justify-between w-full">
                <div>
                  <h3 className="text-l font-bold text-white">{ad.title}</h3>
                </div>
                <button className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-opacity-90 transition-colors cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdSection;
