import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const AgentForm = ({ agent, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || "",
        email: agent.email || "",
        mobile: agent.mobile || "",
        password: "", // Don't populate password for security
      });
    }
  }, [agent]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.mobile.replace(/\s/g, ""))) {
      newErrors.mobile =
        "Please enter a valid mobile number with country code (e.g., +1234567890)";
    }

    if (!agent && !formData.password) {
      newErrors.password = "Password is required for new agents";
    } else if (!agent && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // If editing and password is empty, remove it from submission
      const dataToSubmit = { ...formData };
      if (agent && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      onSubmit(dataToSubmit);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
          placeholder="Enter agent name"
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!errors.email}
          placeholder="Enter agent email"
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mobile Number (with country code)</Form.Label>
        <Form.Control
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          isInvalid={!!errors.mobile}
          placeholder="E.g., +1234567890"
        />
        <Form.Control.Feedback type="invalid">
          {errors.mobile}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          {agent ? "Password (leave blank to keep current)" : "Password"}
        </Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          isInvalid={!!errors.password}
          placeholder="Enter password"
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onCancel} className="me-2">
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {agent ? "Update Agent" : "Add Agent"}
        </Button>
      </div>
    </Form>
  );
};

export default AgentForm;
