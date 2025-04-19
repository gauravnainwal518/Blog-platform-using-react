import React from "react";
import { Container, Logo } from "../index";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-100 to-white shadow-md py-6 mt-10">
      <Container>
        <div className="flex justify-between items-center">
          {/* Logo in Footer */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo width="70px" />
          </Link>

          {/* Footer Navigation */}
          <div className="flex justify-center items-center w-full">
            <ul className="flex items-center space-x-6">
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 font-bold hover:text-purple-600 transition-all duration-300"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 font-bold hover:text-purple-600 transition-all duration-300"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-center text-gray-500 mt-6">
          <p className="font-bold">
            &copy; {new Date().getFullYear()} LumiBlog. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
