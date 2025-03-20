import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

// Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agent";
import ListManagement from "./pages/ListManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Custom CS
import "./App.css";
import AuthProvider from "./context/AuthContext";
import AgentDetails from "./components/AgentDetails";

const API_URL = "https://machine-test-h0sq.onrender.com";

// Function to make API requests using fetch
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (response.status === 401) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      window.location = "/login";
      return;
    }

    return response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

const App = () => {
  useEffect(() => {
    // Attempt an API request to verify token validity
    fetchWithAuth("/verify-token").catch(() => {
      console.log("Invalid token or network issue");
    });
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
              <Route path="/lists/agent/:id" element={<AgentDetails />} />

              <Route path="/" element={<Dashboard />} />
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
