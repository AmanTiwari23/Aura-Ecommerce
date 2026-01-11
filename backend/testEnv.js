require("dotenv").config();
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Loaded" : "❌ Missing");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing");