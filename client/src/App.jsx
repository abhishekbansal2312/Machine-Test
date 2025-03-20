import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import axios from "axios";

// Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agent";
import ListManagement from "./pages/ListManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Custom CSS
import "./App.css";
import AuthProvider from "./context/AuthContext";

const App = () => {
  useEffect(() => {
    // Set the default base URL for axios requests
    axios.defaults.baseURL = "http://localhost:5004";

    // Set the auth token for all requests if it exists
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Handle 401 Unauthorized responses globally
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userInfo");
          localStorage.removeItem("token");
          window.location = "/login";
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agents"
                element={
                  <ProtectedRoute>
                    <Agents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lists"
                element={
                  <ProtectedRoute>
                    <ListManagement />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="*"
                element={
                  <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-800">404</h1>
                      <h3 className="text-xl font-semibold mt-2 text-gray-700">
                        Page Not Found
                      </h3>
                      <p className="mt-2 text-gray-600">
                        The page you are looking for does not exist.
                      </p>
                      <Link
                        to="/dashboard"
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Back to Dashboard
                      </Link>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
