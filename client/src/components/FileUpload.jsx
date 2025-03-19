import React, { useState } from "react";

const FileUpload = ({ onUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");

    if (!selectedFile) {
      return;
    }

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    if (
      !validTypes.includes(selectedFile.type) &&
      !["csv", "xlsx", "xls"].includes(fileExtension)
    ) {
      setError("Please upload a valid CSV, XLSX, or XLS file.");
      setFile(null);
      return;
    }

    // Proceed with valid file
    setFile(selectedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    onUpload(formData);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
            />
          </svg>
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">CSV, XLSX, or XLS up to 10MB</p>
        </div>
      </div>

      {file && (
        <div className="bg-gray-50 p-3 rounded-md shadow-sm">
          <p className="text-sm font-medium text-gray-700">Selected File:</p>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                clipRule="evenodd"
              />
            </svg>
            {file.name}
          </div>
        </div>
      )}

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!file || isLoading}
          onClick={handleSubmit}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            !file || isLoading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isLoading ? "Uploading..." : "Upload and Distribute"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
