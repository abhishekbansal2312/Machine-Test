import axios from "axios";

// Auth API
export const loginUser = async (credentials) => {
  const { data } = await axios.post("/api/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axios.post("/api/auth/register", userData);
  return data;
};

// Agent API
export const createAgent = async (agentData) => {
  const { data } = await axios.post("/api/agents", agentData);
  return data;
};

export const getAgents = async () => {
  const { data } = await axios.get("/api/agents");
  return data;
};

export const getAgentById = async (id) => {
  const { data } = await axios.get(`/api/agents/${id}`);
  return data;
};

export const updateAgent = async (id, agentData) => {
  const { data } = await axios.put(`/api/agents/${id}`, agentData);
  return data;
};

export const deleteAgent = async (id) => {
  const { data } = await axios.delete(`/api/agents/${id}`);
  return data;
};

// List API
export const uploadAndDistributeList = async (formData) => {
  const { data } = await axios.post("/api/lists/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getListsByAgentId = async (agentId) => {
  const { data } = await axios.get(`/api/lists/agent/${agentId}`);
  return data;
};

export const getAllLists = async () => {
  const { data } = await axios.get("/api/lists");
  return data;
};
