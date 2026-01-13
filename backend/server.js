const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Initialize DB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// FIXED CORS CONFIGURATION
app.use(cors({
    origin: [
        "https://aura-ecommerce-mu.vercel.app", 
        "https://aura-ecommerce-aman-tiwaris-projects-92dd9771.vercel.app", 
        "http://localhost:5173"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Basic Route
app.get("/", (req, res) => {
    res.send("Aura API is running...");
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); 
});