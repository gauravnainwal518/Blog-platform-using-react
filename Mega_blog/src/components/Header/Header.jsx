import React, { useState } from "react";
import { LogoutBtn } from "../index";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
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

  const generalLinks = navItems.filter((item) =>
    ["Home", "AI Search", "All Posts", "Add Post"].includes(item.name)
  );

  const specialLinks = navItems.filter((item) =>
    ["Dashboard", "Drafts"].includes(item.name)
  );

  const authLinks = navItems.filter((item) =>
    ["Login", "Signup"].includes(item.name)
  );

  const isActive = (slug) => location.pathname === slug;

  return (
    <header className="bg-gradient-to-r from-gray-100 to-white shadow-md py-4 px-4">
      <nav className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/typenest.png"
            alt="TypeNest Logo"
            className="w-12 h-12 rounded-full object-cover transition-transform hover:scale-105"
          />
          <span className="text-2xl font-extrabold tracking-tight text-blue-600">
            TypeNest
          </span>
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-blue-600"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6">
          {generalLinks.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 font-medium rounded-md transition ${
                      isActive(item.slug)
                        ? "bg-blue-600 text-white"
                        : "text-blue-700 hover:bg-blue-100 hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {authLinks.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 font-medium rounded-md transition ${
                      isActive(item.slug)
                        ? "bg-green-600 text-white"
                        : "text-green-700 hover:bg-green-100 hover:text-green-600"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {specialLinks.some((item) => item.active) && (
            <div className="h-6 w-px bg-gray-400 mx-2" />
          )}

          {specialLinks.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`px-4 py-2 font-semibold rounded-md border transition ${
                      isActive(item.slug)
                        ? "bg-purple-600 text-white"
                        : "text-purple-700 border-purple-400 hover:bg-purple-100 hover:text-purple-600"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              )
          )}

          {authStatus && <LogoutBtn />}
        </ul>
      </nav>

      {/* Mobile Nav */}
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
                      ? "bg-blue-600 text-white"
                      : "text-blue-700 hover:bg-blue-100 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            ))}

          {authStatus && <LogoutBtn />}
        </ul>
      )}
    </header>
  );
}

export default Header;
