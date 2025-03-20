import React, { useState, useEffect } from "react";
import AgentList from "../components/AgentList";
import AgentModal from "../components/AgentModal";
import {
  getAllAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
} from "../api/api";

const AgentPage = () => {
  const [agents, setAgents] = useState([]);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all agents when component mounts
  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const data = await getAllAgents();
      setAgents(data);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError("Failed to load agents. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage("");

      if (currentAgent) {
        // Update existing agent
        await updateAgent(currentAgent._id, formData);
        setSuccessMessage("Agent updated successfully!");
      } else {
        // Create new agent
        await createAgent(formData);
        setSuccessMessage("Agent created successfully!");
      }

      // Refresh the agent list
      fetchAgents();

      // Close modal and reset current agent
      setIsModalOpen(false);
      setCurrentAgent(null);

      // Show success message
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error saving agent:", err);
      setError(err.response?.data?.message || "Failed to save agent.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentAgent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (agentId) => {
    try {
      setLoading(true);
      const data = await getAgentById(agentId);
      setCurrentAgent(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching agent details:", err);
      setError("Failed to load agent details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAgent(null);
  };

  const handleDelete = async (agentId) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        setIsDeleting(true);
        await deleteAgent(agentId);

        // Update the agents list after deletion
        setAgents(agents.filter((agent) => agent._id !== agentId));
        setSuccessMessage("Agent deleted successfully!");

        // Show success message
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (err) {
        console.error("Error deleting agent:", err);
        setError(err.response?.data?.message || "Failed to delete agent.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Agents</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Success and Error Messages */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Close</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccessMessage("")}
            >
              <span className="sr-only">Close</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {/* Agent Modal */}
        <AgentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          agent={currentAgent}
          onSubmit={handleSubmit}
          isLoading={loading}
        />

        {/* Agent List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                All Agents
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                A list of all agents in the system.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Agent
            </button>
          </div>
          <div className="border-t border-gray-200">
            {loading && !isModalOpen ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <AgentList
                agents={agents}
                onDelete={handleDelete}
                onEdit={handleOpenEditModal}
                isDeleting={isDeleting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
