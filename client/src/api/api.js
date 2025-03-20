const API_URL = "https://machine-test-h0sq.onrender.com/api";

// Helper function for making requests
const request = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// Auth services
export const register = (userData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const login = async (credentials) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Agent services
export const createAgent = (agentData) =>
  request("/agents", {
    method: "POST",
    body: JSON.stringify(agentData),
  });

export const getAllAgents = () => request("/agents");

export const getAgentById = (id) => request(`/agents/${id}`);

export const updateAgent = (id, agentData) =>
  request(`/agents/${id}`, {
    method: "PUT",
    body: JSON.stringify(agentData),
  });

export const deleteAgent = (id) =>
  request(`/agents/${id}`, { method: "DELETE" });

// List services
export const uploadList = (formData) =>
  request("/lists/upload", {
    method: "POST",
    body: formData, // `fetch` can handle FormData directly
    headers: {}, // No need to set Content-Type for FormData; the browser does it automatically
  });

export const getListsByAgentId = (agentId) =>
  request(`/lists/agent/${agentId}`);

export const getAllLists = () => request("/lists");

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
