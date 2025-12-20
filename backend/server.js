const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
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



const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log("server running on port 5000");
});
