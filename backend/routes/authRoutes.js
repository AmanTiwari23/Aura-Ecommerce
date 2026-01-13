const express = require("express");
const router = express.Router();

// 1. Import everything in one block to keep it clean
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,forgotPassword,
  resetPassword,
  updatePassword
} = require("../controllers/authController");

// 2. Import middleware
const { protect } = require("../middleware/authMiddleware");

// --- Public Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);

// --- Logout Route (Fixed the typo from /logoutr to /logout) ---
router.post("/logout", logoutUser);

// --- Private Routes ---
router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);

// This handles the OTP verification and new password setting
router.post("/reset-password", resetPassword);

// This handles the password change for logged-in users
router.put("/update-password", protect, updatePassword);

module.exports = router;