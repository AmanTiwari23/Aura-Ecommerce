const express = require("express");
const router = express.Router();
const { getBanners, addBanner } = require("../controllers/bannerController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/", getBanners);
router.post("/",protect,adminOnly,addBanner);

module.exports = router;
