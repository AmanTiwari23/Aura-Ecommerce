const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); 
const { addProduct, getAllProducts, getSingleProduct, getProductsByTag,deleteProduct } = require("../controllers/productController");
const { addReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");


router.use((req, res, next) => {
  console.log(`📡 Route Hit: ${req.method} ${req.originalUrl}`);
  next();
});


router.post("/", protect, adminOnly, upload.array("images", 5), addProduct);


router.get("/", getAllProducts);


router.get("/:id", getSingleProduct);


router.get("/tag/:tag", getProductsByTag);


router.post("/:id/review", protect, addReview);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;