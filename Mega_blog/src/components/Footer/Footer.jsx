import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full py-6 border-t bg-white text-gray-700 border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center space-y-3 text-center">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/typenest.png"
            alt="TypeNest Logo"
            className="w-10 h-10 rounded-full object-cover shadow-md hover:scale-105 transition-transform"
          />
          <span className="text-xl font-extrabold tracking-wide text-blue-600">
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
