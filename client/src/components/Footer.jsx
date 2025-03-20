// Footer Component with Tailwind CSS
import { Link, useLocation } from "react-router-dom";
import {
  FaCode,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaBars,
  FaTimes,
} from "react-icons/fa";
const Footer = () => {
  const location = useLocation();

  // Only show the footer if the user is logged in (not on login page)
  if (location.pathname === "/login") return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <FaCode className="text-blue-600 mr-2" size={18} />
              <span className="font-semibold text-gray-600">Machine Code</span>
            </div>
            <div className="mt-1 text-gray-500 text-sm">
              &copy; {currentYear} Machine Code. All rights reserved.
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
