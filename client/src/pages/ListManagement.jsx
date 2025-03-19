/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Tabs,
  Tab,
  Table,
  Spinner,
} from "react-bootstrap";
import { FaUpload, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import Layout from "../components/Layout";

const ListManagement = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose file");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [agentLists, setAgentLists] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get("/api/agents");
      setAgents(data);
      if (data.length > 0) {
        setSelectedAgent(data[0]._id);
        await fetchAgentLists(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentLists = async (agentId) => {
    try {
      const { data } = await axios.get(`/api/lists/agent/${agentId}`);
      setAgentLists((prev) => ({ ...prev, [agentId]: data }));
    } catch (error) {
      console.error("Error fetching agent lists:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file extension
      const fileExt = selectedFile.name.split(".").pop().toLowerCase();
      if (!["csv", "xlsx", "xls"].includes(fileExt)) {
        setUploadError(
          "Invalid file format. Only CSV, XLSX, and XLS files are allowed."
        );
        setFile(null);
        setFileName("Choose file");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setUploadError("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/lists/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(
        "File uploaded successfully. Lists have been distributed to agents."
      );
      setFile(null);
      setFileName("Choose file");

      // Refresh agent lists
      agents.forEach((agent) => {
        fetchAgentLists(agent._id);
      });
    } catch (error) {
      setUploadError(
        error.response?.data?.message ||
          "Failed to upload file. Please make sure it has the correct format."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleTabSelect = (agentId) => {
    setSelectedAgent(agentId);
    if (!agentLists[agentId]) {
      fetchAgentLists(agentId);
    }
  };

  return (
    <Layout>
      <Container className="mt-4">
        <h2 className="mb-4">List Management</h2>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Upload New List</Card.Title>
            <Card.Subtitle className="mb-3 text-muted">
              Upload CSV file to distribute tasks among agents
            </Card.Subtitle>

            {uploadError && <Alert variant="danger">{uploadError}</Alert>}
            {uploadSuccess && <Alert variant="success">{uploadSuccess}</Alert>}

            <Form onSubmit={handleUpload}>
              <Form.Group className="mb-3">
                <Form.Label>Select File (CSV, XLSX, XLS)</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.xls"
                    className="form-control"
                    aria-describedby="fileHelp"
                  />
                </div>
                <Form.Text id="fileHelp" muted>
                  The file should contain FirstName, Phone, and Notes columns
                </Form.Text>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={!file || uploading}
                className="d-flex align-items-center"
              >
                {uploading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaUpload className="me-2" /> Upload & Distribute
                  </>
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title className="mb-3">Agent Lists</Card.Title>

            {loading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : agents.length === 0 ? (
              <Alert variant="info">
                No agents found. Please add agents first before distributing
                lists.
              </Alert>
            ) : (
              <Tabs
                activeKey={selectedAgent}
                onSelect={handleTabSelect}
                id="agent-lists-tabs"
                className="mb-3"
              >
                {agents.map((agent) => (
                  <Tab key={agent._id} eventKey={agent._id} title={agent.name}>
                    {!agentLists[agent._id] ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" size="sm" />
                      </div>
                    ) : agentLists[agent._id].length === 0 ? (
                      <Alert variant="info">
                        No lists assigned to this agent yet.
                      </Alert>
                    ) : (
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>First Name</th>
                            <th>Phone</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agentLists[agent._id].map((item, index) => (
                            <tr key={item._id}>
                              <td>{index + 1}</td>
                              <td>{item.firstName}</td>
                              <td>{item.phone}</td>
                              <td>{item.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Tab>
                ))}
              </Tabs>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  );
};

export default ListManagement;
