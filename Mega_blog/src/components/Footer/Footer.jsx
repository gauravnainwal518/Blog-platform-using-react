import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <footer
      className={`w-full py-6 border-t transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900 text-gray-300 border-gray-700"
          : "bg-white text-gray-700 border-gray-200"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center space-y-3 text-center">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/typenest.png"
            alt="TypeNest Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md hover:scale-105 transition-transform"
          />
          <span
            className={`text-xl font-extrabold tracking-wide ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            TypeNest
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-sm font-medium">
          &copy; {new Date().getFullYear()} CodeNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
