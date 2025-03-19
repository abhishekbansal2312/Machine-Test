// server/routes/agentRoutes.js
const express = require("express");
const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} = require("../controllers/agentController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, admin, createAgent)
  .get(protect, admin, getAgents);

router
  .route("/:id")
  .get(protect, admin, getAgentById)
  .put(protect, admin, updateAgent)
  .delete(protect, admin, deleteAgent);

module.exports = router;
