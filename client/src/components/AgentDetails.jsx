import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Import the specific functions instead of the default export
import { getAgentById, getListsByAgentId } from "../api/api";

const AgentDetails = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setLoading(true);

        // Use the named export functions directly
        const agentData = await getAgentById(id);
        setAgent(agentData);

        // Use the named export function for lists
        const listsData = await getListsByAgentId(id);
        setLists(listsData);

        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch agent details"
        );
        setLoading(false);
      }
    };

    fetchAgentDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="ml-2">Loading agent details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!agent) {
    return <div className="p-4">Agent not found</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Agent Details */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold border-b pb-2">Agent Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold">{agent.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg">{agent.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Mobile</p>
            <p className="text-lg">{agent.mobile}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ID</p>
            <p className="text-lg text-gray-600">{agent._id}</p>
          </div>
        </div>
      </div>

      {/* Assigned Lists */}
      <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
        <h2 className="text-lg font-semibold border-b pb-2">Assigned Lists</h2>
        {lists.length === 0 ? (
          <p className="text-gray-500 mt-2">No lists assigned to this agent.</p>
        ) : (
          <div className="space-y-4 mt-4">
            {lists.map((list) => (
              <div
                key={list._id}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50"
              >
                <p className="text-sm font-medium text-gray-500">
                  List ID: {list._id}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(list.createdAt).toLocaleString()}
                </p>
                <p className="mt-2 font-medium">Items: {list.items.length}</p>

                {/* List Items Table */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">List Items:</h4>
                  <div className="max-h-64 overflow-y-auto border rounded-md">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Phone
                          </th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {list.items.map((item, index) => (
                          <tr key={item._id || index} className="bg-white">
                            <td className="py-2 px-3 text-sm">
                              {item.firstName}
                            </td>
                            <td className="py-2 px-3 text-sm">{item.phone}</td>
                            <td className="py-2 px-3 text-sm">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDetails;
