const express = require("express");
const router = express.Router();


const {
  createCategory,
  getAllCategories,
  deleteCategory, 
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");


router.route("/")
  .get(getAllCategories)
  .post(protect, adminOnly, createCategory);


router.route("/:id")
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;