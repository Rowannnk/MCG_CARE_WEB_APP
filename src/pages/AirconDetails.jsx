import React, { useState } from "react";
import { useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { StarIcon, Heart, ShoppingCart } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const AirconDetails = () => {
  const { id } = useParams();
  const { products } = useAppContext();
  const aircon = products.find((item) => item._id.toString() === id);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!aircon) return <div className="text-red-500">Aircon not found.</div>;

  const handleBuyNow = () => {
    console.log("Buying:", aircon.title);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-30 md:pt-50 min-h-screen py-12">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Image Section - Reduced width */}
        <div className="lg:w-2/5 xl:w-1/3 ">
          <img
            src={aircon.images[0]}
            alt={aircon.title}
            className="w-full h-160 max-h-[500px] rounded-xl object-cover"
          />
        </div>

        {/* Content Section - Increased width */}
        <div className="lg:w-3/6 xl:w-2/4 relative flex flex-col gap-6">
          <BlurCircle top="-100px" left="-140px" />

          <div>
            <p className="text-primary">ENGLISH</p>
            <h1 className="text-3xl font-bold mt-2">{aircon.title}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <StarIcon className="w-5 h-5 text-primary fill-primary" />
              {aircon.specs.energy_rating} User Rating
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg">
            {aircon.description}
          </p>

          {/* Specifications Section - Now wider */}
          <div className="mt-6 border-t pt-6">
            <h2 className="text-2xl font-bold mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(aircon.specs).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 capitalize">
                    {key.replace("_", " ")}
                  </h3>
                  <p className="text-lg font-medium mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tagline Section */}
          {aircon.tagline && (
            <div className="mt-6 bg-primary/10 p-6 rounded-lg">
              <p className="text-primary text-xl font-medium italic">
                "{aircon.tagline}"
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 sticky bottom-0 bg-white pt-4 pb-8">
            <button
              onClick={handleBuyNow}
              className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors flex-1 justify-center text-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              Buy Now - THB {aircon.price.toLocaleString()}
            </button>
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-3 px-8 py-4 rounded-lg border-2 transition-colors flex-1 justify-center text-lg ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Heart
                className={`w-6 h-6 ${isFavorite ? "fill-red-500" : ""}`}
              />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirconDetails;
