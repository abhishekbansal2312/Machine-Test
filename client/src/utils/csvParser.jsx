/**
 * Utility functions for parsing and validating CSV files
 */

export const parseCSV = (csvContent) => {
  // Split the CSV content into lines
  const lines = csvContent.split("\n");

  // Get the header line and parse it
  const headerLine = lines[0];
  const headers = headerLine.split(",").map((header) => header.trim());

  // Validate required headers
  const requiredHeaders = ["FirstName", "Phone", "Notes"];
  const missingHeaders = requiredHeaders.filter(
    (header) => !headers.includes(header)
  );

  if (missingHeaders.length > 0) {
    throw new Error(
      `CSV is missing required headers: ${missingHeaders.join(", ")}`
    );
  }

  // Parse the data rows
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines

    const values = lines[i].split(",");
    if (values.length !== headers.length) {
      throw new Error(`Line ${i + 1} has an incorrect number of values`);
    }

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index].trim();
    });

    rows.push(row);
  }

  return rows;
};

export const validateCSVData = (data) => {
  const errors = [];

  data.forEach((row, index) => {
    // Validate FirstName
    if (!row.FirstName) {
      errors.push(`Row ${index + 1}: FirstName is required`);
    }

    // Validate Phone
    if (!row.Phone) {
      errors.push(`Row ${index + 1}: Phone is required`);
    } else if (!/^\d+$/.test(row.Phone)) {
      errors.push(`Row ${index + 1}: Phone should contain only numbers`);
    }
  });

  return errors;
};

export default {
  parseCSV,
  validateCSVData,
};
