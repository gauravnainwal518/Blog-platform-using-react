import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <footer
      className={`${
        isDarkMode
          ? "bg-gradient-to-r from-gray-800 to-black text-white"
          : "bg-gradient-to-r from-gray-100 to-white text-gray-800"
      } shadow-md py-6 mt-0`}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 justify-center md:justify-start"
        >
          <img
            src="/typenest.png"
            alt="TypeNest Logo"
            className="rounded-full w-16 h-16 object-cover transform transition-transform duration-300 hover:scale-110"
          />
          <span
            className={`text-2xl font-extrabold ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            } tracking-wide`}
          >
            TypeNest
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex justify-center items-center">
          <ul className="flex flex-wrap justify-center items-center gap-4">
            {[
              "About",
              "Contact",
              "Services",
              "Privacy Policy",
              "Terms of Service",
            ].map((item) => (
              <li key={item}>
                <Link
                  to="/"
                  className={`${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  } font-bold hover:text-purple-600 transition-all duration-300`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright */}
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
