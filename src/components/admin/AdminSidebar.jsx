import React from "react";
import { assets } from "../../assets/assets";
import {
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusCircleIcon,
  PlusSquareIcon,
  User,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const user = {
    firstName: "Admin",
    lastName: "John",
    imageUrl: assets.profile1,
  };
  const adminNavLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Add Products",
      path: "/admin/add-products",
      icon: PlusSquareIcon,
    },
    {
      name: "List Products",
      path: "/admin/list-products",
      icon: ListIcon,
    },
    {
      name: "List Bookings",
      path: "/admin/list-bookings",
      icon: ListCollapseIcon,
    },
    {
      name: "Add Technician",
      path: "/admin/add-technician",
      icon: PlusCircleIcon,
    },
    { path: "/admin/users", icon: User, name: "User Management" },
  ];
  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 border-b w-full border-r border-gray-300/80 text-sm">
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={user.imageUrl}
            alt="Admin profile"
            className="h-12 md:h-16 w-12 md:w-16 rounded-full object-cover ring-2 ring-primary shadow-lg"
          />
          {/* Optional status indicator */}
          <span className="absolute bottom-1 right-1 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
        </div>
        <p className="mt-3 text-base font-semibold text-gray-700 max-md:hidden">
          {user.firstName}
        </p>
        <p className="text-xs text-gray-400 max-md:hidden">Administrator</p>
      </div>

      <div className="w-full">
        {adminNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${
                isActive && "bg-primary/15 text-primary group"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.name}</p>
                <span
                  className={`w-1.5 h-10 rounded-l right-0 absolute ${
                    isActive && "bg-primary"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
