import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold">
        <NavLink to="/dashboard" className="hover:text-gray-300">
          SHIFT HAPPENS
        </NavLink>
      </div>

      {/* Links */}
      <div className="flex gap-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "text-gray-300 font-semibold"
              : "hover:text-gray-300"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            isActive
              ? "text-gray-300 font-semibold"
              : "hover:text-gray-300"
          }
        >
          Schedule
        </NavLink>
        <NavLink
          to="/exports"
          className={({ isActive }) =>
            isActive
              ? "text-gray-300 font-semibold"
              : "hover:text-gray-300"
          }
        >
          Exports
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "text-gray-300 font-semibold"
              : "hover:text-gray-300"
          }
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;