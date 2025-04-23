import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  // Access the theme state from Redux store
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <footer
      className={`${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-black text-white"
          : "bg-gradient-to-r from-gray-100 to-white text-gray-800"
      } shadow-md py-6 mt-0`}
    >
      <div className="flex justify-between items-center mb-6">
        {/* Logo in Footer */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/typenest.jpg" // Replace with your logo file name in the public folder
            alt="CodeNest Logo"
            className="rounded-full w-16 h-16 object-cover transform transition-all duration-300 hover:scale-110" // Makes logo rounded and zoomed on hover
          />
          <span
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            } tracking-wide`}
          >
            TypeNest
          </span>
        </Link>

        {/* Footer Navigation */}
        <div className="flex justify-center items-center w-full">
          <ul className="flex items-center space-x-6">
            <li>
              <Link
                to="/"
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-bold hover:text-purple-600 transition-all duration-300`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-bold hover:text-purple-600 transition-all duration-300`}
              >
                Contact
              </Link>
            </li>
            {/* Additional Links */}
            <li>
              <Link
                to="/"
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-bold hover:text-purple-600 transition-all duration-300`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-bold hover:text-purple-600 transition-all duration-300`}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } font-bold hover:text-purple-600 transition-all duration-300`}
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="text-center mt-3">
        <p
          className={`font-bold ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          &copy; {new Date().getFullYear()} CodeNest. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
