import React from "react";
import { Table, Spinner, Alert } from "react-bootstrap";

const ListView = ({ items, loading, error }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading lists...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!items || items.length === 0) {
    return (
      <Alert variant="info">
        No list items found. Upload a CSV to distribute tasks.
      </Alert>
    );
  }

  return (
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
        {items.map((item, index) => (
          <tr key={item._id || index}>
            <td>{index + 1}</td>
            <td>{item.firstName}</td>
            <td>{item.phone}</td>
            <td>{item.notes}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ListView;
