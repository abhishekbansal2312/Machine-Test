/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaUpload } from "react-icons/fa";
import { uploadAndDistributeList } from "../services/api";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose file");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file extension
      const fileExt = selectedFile.name.split(".").pop().toLowerCase();
      if (!["csv", "xlsx", "xls"].includes(fileExt)) {
        setError(
          "Invalid file format. Only CSV, XLSX, and XLS files are allowed."
        );
        setFile(null);
        setFileName("Choose file");
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadAndDistributeList(formData);
      setFile(null);
      setFileName("Choose file");

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to upload file. Please make sure it has the correct format."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
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

        <Button type="submit" variant="primary" disabled={!file || uploading}>
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
    </>
  );
};

export default FileUpload;
