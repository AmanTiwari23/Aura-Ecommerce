const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect Middleware
 * Ensures the user is authenticated via Cookie or Authorization Header.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization Header (Primary for Production/Vercel)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // 2. Check Cookies (Fallback/Local Development)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    // 3. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Fetch User and attach to Request
    // Ensure 'userId' matches the key you used in generateToken.js
    const user = await User.findById(decoded.userId || decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User session expired, user not found" });
    }

    // 5. Check if User is Blocked (Crucial for Aura security)
    if (user.isBlocked) {
      return res.status(403).json({ message: "Access denied. Your account is blocked." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Session invalid, please login again" });
  }
};



module.exports = { protect };