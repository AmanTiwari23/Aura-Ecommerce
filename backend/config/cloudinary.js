const cloudinary = require("cloudinary").v2;
require("dotenv").config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


if (!process.env.CLOUDINARY_API_KEY) {
  console.error("⚠️  CLOUDINARY ERROR: API Key is missing. Check your .env file.");
}

module.exports = cloudinary;