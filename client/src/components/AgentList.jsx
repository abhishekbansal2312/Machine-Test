import React from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const AgentList = ({ agents, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading agents...</span>
        </Spinner>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No agents found. Add your first agent using the button above.</p>
      </div>
    );
  }

  return (
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
        {agents.map((agent, index) => (
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
                onClick={() => onEdit(agent)}
              >
                <FaEdit /> Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(agent._id)}
              >
                <FaTrash /> Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AgentList;
