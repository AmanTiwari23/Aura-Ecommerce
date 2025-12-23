const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentControllers");

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
