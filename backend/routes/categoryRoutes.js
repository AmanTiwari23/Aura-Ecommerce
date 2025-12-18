const express = require("express");

const {
  createCategory,
  getAllCategories,
} = require("../controllers/categoryController");

const {protect} = require("../middleware/authMiddleware");
const {adminOnly} = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",protect, adminOnly, createCategory);

router.get("/",getAllCategories);

module.exports = router;