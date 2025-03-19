/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import ListView from "../components/ListView";
import {
  uploadList,
  getAllLists,
  getListsByAgentId,
  getAgentById,
} from "../api/api";

const ListManagement = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [agentDetails, setAgentDetails] = useState(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setLoading(true);
        let data;

        if (agentId) {
          data = await getListsByAgentId(agentId);
          const agent = await getAgentById(agentId);
          setAgentDetails(agent);
        } else {
          data = await getAllLists();
        }

        setLists(data);
      } catch (err) {
        console.error("Error fetching lists:", err);
        setError("Failed to load lists. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [agentId]);

  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      setError(null);
      setSuccess("");

      const result = await uploadList(formData);
      setSuccess("File uploaded and distributed successfully!");

      const updatedLists = await getAllLists();
      setLists(updatedLists);

      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload and distribute the file."
      );
    } finally {
      setUploading(false);
    }
  };

  const pageTitle = agentId
    ? `Lists for ${agentDetails?.name || "Agent"}`
    : "List Management";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          {agentId && (
            <button
              onClick={() => navigate("/lists")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Back to All Lists
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md mb-4">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-md mb-4">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {!agentId && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-2">
              Upload and Distribute New List
            </h3>
            <p className="text-gray-600 mb-4">
              Upload a CSV file to distribute among agents.
            </p>
            <FileUpload onUpload={handleUpload} isLoading={uploading} />
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">
              {agentId ? `Agent Lists` : `All Distributed Lists`}
            </h3>
            <p className="text-gray-600">
              {agentId
                ? `Lists assigned to ${agentDetails?.name || "this agent"}.`
                : "All lists distributed to agents."}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="p-6">
              <ListView lists={lists} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListManagement;
