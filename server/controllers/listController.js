// server/controllers/listController.js
const List = require("../models/List");
const Agent = require("../models/Agent");
const csvParser = require("../utils/csvParser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if the file is a CSV or Excel file
  if (
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only CSV and Excel files are allowed"), false);
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 }, // 5MB
});

const parseFile = (filePath, fileType) => {
  if (fileType === "csv") {
    return csvParser.parseCSV(filePath);
  } else if (fileType === "xlsx" || fileType === "xls") {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
  }
  throw new Error("Unsupported file type");
};

// Distribute list items evenly among agents
const distributeItems = async (items, userId) => {
  try {
    // Get all agents
    const agents = await Agent.find({});

    if (agents.length === 0) {
      throw new Error("No agents found to distribute lists");
    }

    const agentCount = agents.length;
    const itemCount = items.length;
    const baseItemsPerAgent = Math.floor(itemCount / agentCount);
    const remainingItems = itemCount % agentCount;

    const distributions = [];
    let currentIndex = 0;

    // Distribute items among agents
    for (let i = 0; i < agentCount; i++) {
      const agentItems = [];
      // Assign base number of items to each agent
      for (let j = 0; j < baseItemsPerAgent; j++) {
        agentItems.push(items[currentIndex++]);
      }

      // Distribute remaining items
      if (i < remainingItems) {
        agentItems.push(items[currentIndex++]);
      }

      // Save this distribution
      if (agentItems.length > 0) {
        const list = new List({
          agentId: agents[i]._id,
          items: agentItems.map((item) => ({
            firstName: item.FirstName || "",
            phone: item.Phone || "",
            notes: item.Notes || "",
          })),
          uploadedBy: userId,
        });

        await list.save();
        distributions.push({
          agentId: agents[i]._id,
          agentName: agents[i].name,
          itemCount: agentItems.length,
          listId: list._id,
        });
      }
    }

    return distributions;
  } catch (error) {
    console.error("Error distributing items:", error);
    throw error;
  }
};

// @desc    Upload and distribute list
// @route   POST /api/lists/upload
// @access  Private/Admin
exports.uploadAndDistributeList = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Determine file type
    const fileExtension = path
      .extname(req.file.originalname)
      .toLowerCase()
      .substring(1);
    if (!["csv", "xlsx", "xls"].includes(fileExtension)) {
      return res
        .status(400)
        .json({
          message: "Invalid file format. Only CSV, XLSX, and XLS are allowed.",
        });
    }

    // Parse file
    const items = await parseFile(req.file.path, fileExtension);

    // Validate parsed data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid data found in the file" });
    }

    // Check if items have required fields
    const hasRequiredFields = items.every(
      (item) =>
        item.hasOwnProperty("FirstName") &&
        item.hasOwnProperty("Phone") &&
        item.hasOwnProperty("Notes")
    );

    if (!hasRequiredFields) {
      return res.status(400).json({
        message: "CSV must include FirstName, Phone, and Notes columns",
      });
    }

    // Distribute items
    const distributions = await distributeItems(items, req.user._id);

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    res.status(200).json({
      message: "File uploaded and distributed successfully",
      distributions,
    });
  } catch (error) {
    console.error("Upload and distribute error:", error);

    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get lists by agent ID
// @route   GET /api/lists/agent/:agentId
// @access  Private/Admin
exports.getListsByAgentId = async (req, res) => {
  try {
    const lists = await List.find({ agentId: req.params.agentId });

    if (!lists.length) {
      return res.status(404).json({ message: "No lists found for this agent" });
    }

    res.status(200).json(lists);
  } catch (error) {
    console.error("Get lists error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all lists
// @route   GET /api/lists
// @access  Private/Admin
exports.getAllLists = async (req, res) => {
  try {
    const lists = await List.find({})
      .populate("agentId", "name email")
      .populate("uploadedBy", "email");

    res.status(200).json(lists);
  } catch (error) {
    console.error("Get all lists error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
