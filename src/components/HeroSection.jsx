import React from "react";
import backgroundImage from "../assets/hero.png";
import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-cover bg-center h-screen flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36"
    >
      <h1 className="text-5xl md:text-[70px] md:leading-18 font-semibold max-w-150">
        WELCOME <br /> TO MCG CARE
      </h1>
      <BlurCircle top="25%" left="5%" />
      <div className="flex items-center gap-4 text-gray-600">
        <span>Fast | Reliable | Affordable</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4.5 h-4.5" />
          Since 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" />
          Available 7 Days a Week
        </div>
      </div>
      <p className="max-w-md text-gray-600">
        At MCG Air Care, we are your reliable partner for all air conditioning
        needs — from routine cleaning and preventive maintenance to complex
        repairs and system checkups. Our experienced technicians are committed
        to delivering high-quality service with efficiency, honesty, and care.
      </p>
      <button
        onClick={() => navigate("/services")}
        className="mt-4 flex items-center gap-1 bg-primary hover:bg-red-600 px-6 py-3 text-sm rounded-full transition font-medium cursor-pointer text-white"
      >
        Explore Services <ArrowRight className="w-4.5 h-4.5" />
      </button>
    </div>
  );
};

export default HeroSection;
