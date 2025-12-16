const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")

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

const PORT = process.env.PORT || 5000


app.listen(PORT,()=>{
    console.log("server running on port 5000");
});
