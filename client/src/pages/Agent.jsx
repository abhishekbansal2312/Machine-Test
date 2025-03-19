/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import Layout from "../components/Layout";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get("/api/agents");
      setAgents(data);
    } catch (err) {
      setError("Failed to fetch agents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (agent = null) => {
    if (agent) {
      setCurrentAgent(agent);
      setFormData({
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        password: "", // Don't populate password for security
      });
    } else {
      setCurrentAgent(null);
      setFormData({
        name: "",
        email: "",
        mobile: "",
        password: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentAgent) {
        // Update existing agent
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't send empty password
        }

        await axios.put(`/api/agents/${currentAgent._id}`, updateData);
        setSuccess("Agent updated successfully");
      } else {
        // Create new agent
        await axios.post("/api/agents", formData);
        setSuccess("Agent created successfully");
      }

      fetchAgents();
      handleCloseModal();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save agent. Please try again."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) {
      return;
    }

    try {
      await axios.delete(`/api/agents/${id}`);
      setSuccess("Agent deleted successfully");
      fetchAgents();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete agent. Please try again.");
    }
  };

  return (
    <Layout>
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Agent Management</h2>
          <Button variant="primary" onClick={() => handleShowModal()}>
            Add New Agent
          </Button>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No agents found. Add your first agent.
                  </td>
                </tr>
              ) : (
                agents.map((agent, index) => (
                  <tr key={agent._id}>
                    <td>{index + 1}</td>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.mobile}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleShowModal(agent)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(agent._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}

        {/* Agent Form Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {currentAgent ? "Edit Agent" : "Add New Agent"}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter agent name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter agent email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mobile Number (with country code)</Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="E.g., +1234567890"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  {currentAgent
                    ? "Password (leave blank to keep current)"
                    : "Password"}
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required={!currentAgent}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentAgent ? "Update Agent" : "Add Agent"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Layout>
  );
};

export default Agents;
