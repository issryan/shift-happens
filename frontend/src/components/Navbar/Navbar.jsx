import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear authentication state and localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 shadow-md flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold">
        <NavLink to="/dashboard" className="hover:text-gray-300">
          SHIFT HAPPENS
        </NavLink>
      </div>

      {/* Links */}
      <div className="flex gap-6 items-center">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "text-gray-300 font-semibold" : "hover:text-gray-300"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            isActive ? "text-gray-300 font-semibold" : "hover:text-gray-300"
          }
        >
          Schedule
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "text-gray-300 font-semibold" : "hover:text-gray-300"
          }
        >
          Profile
        </NavLink>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;