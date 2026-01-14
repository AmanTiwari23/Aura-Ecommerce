const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// --- REGISTER USER ---
const registerUser = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    
    // 1. Generate token (This sets the cookie)
    const token = generateToken(res, user._id);

    // 2. Return user AND token in JSON body (Crucial for Vercel)
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: token, // Frontend saves this to localStorage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- LOGIN USER ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBlocked) return res.status(403).json({ message: "User is blocked" });

    // 1. Generate token (This sets the cookie)
    const token = generateToken(res, user._id);

    // 2. Return user AND token in JSON body (Fixes 401 on Vercel)
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
        token: token, // Frontend saves this to localStorage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- LOGOUT USER ---
const logoutUser = (req, res) => {
  // Clear the cookie for local development
  res.cookie("token", "", { 
    httpOnly: true, 
    expires: new Date(0),
    secure: true,      // Match production settings
    sameSite: "none"   // Match production settings
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// --- UPDATE PASSWORD ---
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Your Aura Password Reset Code",
        otp: otp,
        message: `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
      });

      res.status(200).json({ message: "OTP sent to your email" });
    } catch (emailError) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Error sending email." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- RESET PASSWORD ---
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword
};