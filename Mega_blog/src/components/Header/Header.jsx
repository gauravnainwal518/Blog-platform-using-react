import React, { useState } from "react";
import { LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "AI Search", slug: "/ai-search", active: true },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-100 to-white dark:from-gray-900 dark:to-black shadow-md py-4 px-4">
      <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo and Platform Name */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/typenest.png"
            alt="TypeNest Logo"
            className="rounded-full w-14 h-14 object-cover transform transition-transform duration-300 hover:scale-110"
          />
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-300 tracking-wide">
            TypeNest
          </span>
        </Link>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-600 dark:text-blue-300 focus:outline-none"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Nav Items (Desktop) */}
        <ul className="hidden md:flex items-center space-x-6">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="text-blue-600 dark:text-blue-300 font-bold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-800 hover:text-purple-600 dark:hover:text-purple-200"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}

          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>

      {/* Nav Items (Mobile Menu) */}
      {isMenuOpen && (
        <ul className="flex flex-col items-start space-y-3 mt-4 md:hidden px-2">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name} className="w-full">
                  <button
                    onClick={() => {
                      navigate(item.slug);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-blue-600 dark:text-blue-300 font-bold px-4 py-2 rounded-lg transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-800 hover:text-purple-600 dark:hover:text-purple-200"
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}

          <li>
            <ThemeToggle />
          </li>
        </ul>
      )}
    </header>
  );
}

export default Header;
