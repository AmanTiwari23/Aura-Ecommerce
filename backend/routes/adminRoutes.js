const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const { getAdminStats } = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);

module.exports = router;
