import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, SearchIcon, UserIcon, XIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="brand_logo" className="w-36 h-auto" />
      </Link>
      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col 
      md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur 
      bg-black/70 md:bg-white/10 md:border border-gray-200 overflow-hidden duration-300 transition-[width] ${
        isOpen ? "max-md:w-full" : "max-md:w-0"
      }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <NavLink
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : ""
          }
        >
          Home
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/aircons"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : ""
          }
        >
          Aircons
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/services"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : ""
          }
        >
          Services
        </NavLink>
        <NavLink
          onClick={() => {
            scrollTo(0, 0);
            setIsOpen(false);
          }}
          to="/favorite"
          className={({ isActive }) =>
            isActive ? "text-primary font-semibold" : ""
          }
        >
          Favorite
        </NavLink>
      </div>
      <div className="flex items-center gap-8">
        <SearchIcon className="w-6 h-6 cursor-pointer max-md:hidden" />
        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="sm:px-7 sm:py-2 px-4 py-1 bg-primary hover:bg-red-600 transition rounded-full cursor-pointer font-medium text-white"
          >
            Login
          </button>
        ) : (
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <UserIcon className="w-6 h-6 text-primary" />
              <span className="text-primary font-semibold">{user.name}</span>
            </div>
            {showDropdown && (
              <div className="absolute left-0 top-full mt-4 w-40 bg-white rounded shadow-md z-50">
                <Link
                  to="/my-booking"
                  className="block px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={() => setShowDropdown(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-red-500 rounded hover:bg-red-600 hover:text-red-200 transition"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <MenuIcon
        className="cursor-pointer h-8 w-8 max-md:ml-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

export default Navbar;
