const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getSingleOrder
} = require("../controllers/orderController");

const router = express.Router();


router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getSingleOrder);



router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
