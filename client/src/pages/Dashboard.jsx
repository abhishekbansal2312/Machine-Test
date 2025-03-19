import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllAgents, getAllLists } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiList, FiDatabase } from "react-icons/fi";
import { MdPersonAdd, MdUpload } from "react-icons/md";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLists: 0,
    totalLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [agents, lists] = await Promise.all([
          getAllAgents(),
          getAllLists(),
        ]);

        const totalLeadsCount = lists.reduce(
          (total, list) => total + (list.items ? list.items.length : 0),
          0
        );

        setStats({
          totalAgents: agents.length,
          totalLists: lists.length,
          totalLeads: totalLeadsCount,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white px-6 py-5 border-b border-gray-200 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            Welcome back, {user?.email}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your lead management system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            {
              label: "Total Agents",
              value: stats.totalAgents,
              icon: <FiUsers />,
              link: "/agents",
            },
            {
              label: "Total Lists",
              value: stats.totalLists,
              icon: <FiList />,
              link: "/lists",
            },
            {
              label: "Total Leads",
              value: stats.totalLeads,
              icon: <FiDatabase />,
              link: "/lists",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-6 py-5 flex items-center">
                <div className="text-indigo-600 text-3xl mr-4">{stat.icon}</div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                    {stat.value}
                  </dd>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4">
                <Link
                  to={stat.link}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/agents/new"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <MdPersonAdd className="mr-2 text-lg" /> Add New Agent
            </Link>
            <Link
              to="/lists"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              <MdUpload className="mr-2 text-lg" /> Upload New List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
