const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Check if we are live on Render or on our local machine
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    // Secure: true means the cookie only travels over HTTPS (Render)
    secure: isProduction, 
    // SameSite: None allows the cookie to jump from Render to Vercel
    sameSite: isProduction ? "none" : "lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token; // Returning it in case you want to send it in the JSON body too
};

module.exports = generateToken;