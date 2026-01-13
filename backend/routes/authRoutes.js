const express = require("express");
const router = express.Router();


const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,forgotPassword,
  resetPassword,
  updatePassword
} = require("../controllers/authController");


const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/logout", logoutUser);

// --- Private Routes ---
router.get("/me", protect, getMe);

router.post("/forgot-password", forgotPassword);

// This handles the OTP verification and new password setting
router.post("/reset-password", resetPassword);

// This handles the password change for logged-in users
router.put("/update-password", protect, updatePassword);

module.exports = router;