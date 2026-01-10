const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { toggleWishlist, getWishlist } = require("../controllers/wishlistController");

const router = express.Router();

router.post("/", protect, toggleWishlist);
router.get("/", protect, getWishlist);

module.exports = router;
