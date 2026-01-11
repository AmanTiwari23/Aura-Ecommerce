const express = require("express");
const router = express.Router();
const { 
  getBanners, getAllBanners, addBanner, toggleBannerStatus, deleteBanner 
} = require("../controllers/bannerController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/", getBanners); // Public
router.get("/admin", protect, adminOnly, getAllBanners); // Admin only
router.post("/", protect, adminOnly, addBanner); // Admin only
router.put("/:id/toggle", protect, adminOnly, toggleBannerStatus); // Admin only
router.delete("/:id", protect, adminOnly, deleteBanner); // Admin only

module.exports = router;