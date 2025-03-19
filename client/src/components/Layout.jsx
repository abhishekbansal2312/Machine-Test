import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // If not logged in, only show the content without navigation
  if (!user) {
    return <div className="h-screen">{children}</div>;
  }

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-700 text-white"
      : "text-indigo-100 hover:bg-indigo-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  Lead Management
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                      "/dashboard"
                    )}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/agents"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                      "/agents"
                    )}`}
                  >
                    Agents
                  </Link>
                  <Link
                    to="/lists"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                      "/lists"
                    )}`}
                  >
                    Lists
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="text-indigo-100 mr-3">{user.email}</div>
                <button
                  onClick={logout}
                  className="bg-indigo-600 px-3 py-1 rounded-md text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(
                "/dashboard"
              )}`}
            >
              Dashboard
            </Link>
            <Link
              to="/agents"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(
                "/agents"
              )}`}
            >
              Agents
            </Link>
            <Link
              to="/lists"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(
                "/lists"
              )}`}
            >
              Lists
            </Link>
            <div className="pt-4 pb-3 border-t border-indigo-700">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 Lead Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
