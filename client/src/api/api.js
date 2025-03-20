import axios from "axios";

const API_URL = "https://machine-test-h0sq.onrender.com/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Agent services
export const createAgent = async (agentData) => {
  const response = await api.post("/agents", agentData);
  return response.data;
};

export const getAllAgents = async () => {
  const response = await api.get("/agents");
  return response.data;
};

export const getAgentById = async (id) => {
  const response = await api.get(`/agents/${id}`);
  return response.data;
};

export const updateAgent = async (id, agentData) => {
  const response = await api.put(`/agents/${id}`, agentData);
  return response.data;
};

export const deleteAgent = async (id) => {
  const response = await api.delete(`/agents/${id}`);
  return response.data;
};

// List services
export const uploadList = async (formData) => {
  const response = await api.post("/lists/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getListsByAgentId = async (agentId) => {
  const response = await api.get(`/lists/agent/${agentId}`);
  return response.data;
};

export const getAllLists = async () => {
  const response = await api.get("/lists");
  return response.data;
};

export default {
  register,
  login,
  logout,
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  uploadList,
  getListsByAgentId,
  getAllLists,
};
