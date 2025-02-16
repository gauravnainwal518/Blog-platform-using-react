import React from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-gray-100 to-white text-gray-700 shadow-md mt-auto">
      <div className="container mx-auto flex flex-col items-center py-6">
        {/* Logo */}
        <div className="mb-4">
          <Logo width="100px" />
        </div>

        {/* Links */}
        <div className="flex space-x-6">
          <Link
            className="text-base font-medium hover:text-gray-500 transition-colors"
            to="/privacy-policy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-base font-medium hover:text-gray-500 transition-colors"
            to="/contact-us"
          >
            Contact Us
          </Link>
        </div>

        {/* Copyright */}
        <p className="mt-4 text-sm">
          &copy; {new Date().getFullYear()} All Rights Reserved by DevUI.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
