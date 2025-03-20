import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaCode,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext"; // Adjust the import path as needed

// Header Component with Tailwind CSS
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, logout } = useContext(AuthContext); // Access auth context

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // If on login page, show a simplified header
  if (location.pathname === "/login") {
    return (
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <FaCode className="text-blue-600 mr-2" size={24} />
              <span className="font-bold text-xl text-gray-800">
                Machine Code
              </span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center">
            <FaCode className="text-blue-600 mr-2" size={24} />
            <span className="font-bold text-xl text-gray-800">
              Machine Code
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-6 mr-6">
              <NavLink
                to="/dashboard"
                active={location.pathname === "/dashboard"}
              >
                Dashboard
              </NavLink>
              <NavLink to="/agents" active={location.pathname === "/agents"}>
                Agents
              </NavLink>
              <NavLink to="/lists" active={location.pathname === "/lists"}>
                Lists
              </NavLink>
            </nav>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-gray-600 flex items-center">
                  <FaUser className="mr-2" size={14} />
                  <span className="font-medium">{user.name || user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
                >
                  <FaSignOutAlt className="mr-1" size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors text-sm font-medium"
              >
                <FaSignInAlt className="mr-1" size={14} />
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <NavLink
                to="/dashboard"
                active={location.pathname === "/dashboard"}
              >
                Dashboard
              </NavLink>
              <NavLink to="/agents" active={location.pathname === "/agents"}>
                Agents
              </NavLink>
              <NavLink to="/lists" active={location.pathname === "/lists"}>
                Lists
              </NavLink>

              {/* Mobile auth buttons */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                {user ? (
                  <>
                    <div className="text-gray-600 mb-2 flex items-center">
                      <FaUser className="mr-2" size={14} />
                      <span className="font-medium">
                        {user.name || user.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                    >
                      <FaSignOutAlt className="mr-1" size={14} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center w-full text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    <FaSignInAlt className="mr-1" size={14} />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

// NavLink Component for consistent styling
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md transition-colors ${
      active
        ? "font-semibold text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
    }`}
  >
    {children}
  </Link>
);

export default Header;
