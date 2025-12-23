const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
dotenv.config();
connectDB();

const app = express();


app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
})
);



app.get("/",(req,res)=>{
    res.send("aura api is running");
});
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log("server running on port 5000");
});
