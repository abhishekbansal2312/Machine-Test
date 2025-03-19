/* eslint-disable no-useless-catch */
import * as XLSX from "xlsx";
import Papa from "papaparse";

// Function to parse CSV file
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(results.errors);
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

// Function to parse Excel file (XLSX/XLS)
export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsBinaryString(file);
  });
};

// Main function to parse file based on type
export const parseFile = async (file) => {
  const fileExtension = file.name.split(".").pop().toLowerCase();

  try {
    let data;

    if (fileExtension === "csv") {
      data = await parseCSV(file);
    } else if (["xlsx", "xls"].includes(fileExtension)) {
      data = await parseExcel(file);
    } else {
      throw new Error("Unsupported file format");
    }

    // Validate required columns
    validateColumns(data);

    return data;
  } catch (error) {
    throw error;
  }
};

// Function to validate if data has required columns
const validateColumns = (data) => {
  if (!data || data.length === 0) {
    throw new Error("File contains no data");
  }

  const firstRow = data[0];
  const requiredColumns = ["FirstName", "Phone", "Notes"];

  // Check if all required columns exist (case insensitive)
  const columnKeys = Object.keys(firstRow).map((key) => key.toLowerCase());

  for (const col of requiredColumns) {
    if (!columnKeys.includes(col.toLowerCase())) {
      throw new Error(`Required column "${col}" is missing`);
    }
  }

  return true;
};

// Function to convert data to consistent format
export const normalizeData = (data) => {
  return data.map((row) => {
    // Find the actual column names regardless of case
    const keys = Object.keys(row);
    const firstNameKey = keys.find((key) => key.toLowerCase() === "firstname");
    const phoneKey = keys.find((key) => key.toLowerCase() === "phone");
    const notesKey = keys.find((key) => key.toLowerCase() === "notes");

    return {
      firstName: row[firstNameKey] || "",
      phone: row[phoneKey] || "",
      notes: row[notesKey] || "",
    };
  });
};
