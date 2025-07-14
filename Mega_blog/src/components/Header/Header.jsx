import React, { useState } from "react";
import { LogoutBtn } from "../index";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "AI Search", slug: "/ai-search", active: true },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
    { name: "Drafts", slug: "/drafts", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ];

  const generalLinks = navItems.filter(
    (item) =>
      item.name === "Home" ||
      item.name === "AI Search" ||
      item.name === "All Posts" ||
      item.name === "Add Post"
  );

  const specialLinks = navItems.filter(
    (item) => item.name === "Dashboard" || item.name === "Drafts"
  );

  const authLinks = navItems.filter(
    (item) => item.name === "Login" || item.name === "Signup"
  );

  const isActive = (slug) => location.pathname === slug;

  return (
    <header className="bg-gradient-to-r from-gray-100 to-white dark:from-gray-900 dark:to-black shadow-md py-4 px-4">
      <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/typenest.png"
            alt="TypeNest Logo"
            className="w-12 h-12 rounded-full object-cover transition-transform hover:scale-105"
          />
          <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-300">
            TypeNest
          </span>
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-600 dark:text-blue-300"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {/* General Links */}
          {generalLinks.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 font-medium rounded-md transition ${
                      isActive(item.slug)
                        ? "bg-blue-600 text-white dark:bg-blue-500"
                        : "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {/* Auth Links */}
          {authLinks.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 font-medium rounded-md transition ${
                      isActive(item.slug)
                        ? "bg-green-600 text-white dark:bg-green-500"
                        : "text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 hover:text-green-600 dark:hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {/* Divider */}
          {specialLinks.some((item) => item.active) && (
            <div className="h-6 w-px bg-gray-400 dark:bg-gray-600 mx-2" />
          )}

          {/* Dashboard & Drafts */}
          {specialLinks.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 font-semibold rounded-md border transition ${
                      isActive(item.slug)
                        ? "bg-purple-600 text-white dark:bg-purple-500"
                        : "text-purple-700 dark:text-purple-300 border-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 hover:text-purple-600 dark:hover:text-white"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {/* Logout & Theme */}
          {authStatus && <LogoutBtn />}
          <ThemeToggle />
        </ul>
      </nav>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <ul className="flex flex-col mt-4 gap-3 px-2 md:hidden">
          {[...generalLinks, ...authLinks, ...specialLinks]
            .filter((item) => item.active)
            .map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    navigate(item.slug);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 font-medium rounded-md transition ${
                    isActive(item.slug)
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}

          {authStatus && <LogoutBtn />}
          <ThemeToggle />
        </ul>
      )}
    </header>
  );
}

export default Header;
