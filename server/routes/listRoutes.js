// server/routes/listRoutes.js
const express = require("express");
const {
  uploadAndDistributeList,
  getListsByAgentId,
  getAllLists,
} = require("../controllers/listController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();
const { upload } = require("../controllers/listController");

router.post(
  "/upload",
  protect,
  admin,
  upload.single("file"),
  uploadAndDistributeList
);
router.get("/agent/:agentId", protect, admin, getListsByAgentId);
router.get("/", protect, admin, getAllLists);

module.exports = router;
