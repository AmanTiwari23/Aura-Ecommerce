const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getSingleOrder,
  getSalesStats 
} = require("../controllers/orderController");

const router = express.Router();

router.get("/sales-stats", protect, adminOnly, getSalesStats);

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);


router.get("/", protect, adminOnly, getAllOrders);


router
  .route("/:id")
  .get(protect, getSingleOrder)
  .put(protect, adminOnly, updateOrderStatus); 

module.exports = router;