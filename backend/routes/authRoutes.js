const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/authController");

const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logoutr",logoutUser);
router.get("/me", protect, getMe);

module.exports = router ;