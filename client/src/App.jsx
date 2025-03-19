import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";

// Components
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agent";
import ListManagement from "./pages/ListManagement";
import ProtectedRoute from "./components/ProtectedRoute";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Custom CSS
import "./App.css";

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
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
              <div className="text-center">
                <h1>404</h1>
                <h3>Page Not Found</h3>
                <p>The page you are looking for does not exist.</p>
                <a href="/dashboard" className="btn btn-primary">
                  Back to Dashboard
                </a>
              </div>
            </Container>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
