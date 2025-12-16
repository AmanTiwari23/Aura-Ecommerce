const mongoose = require("mongoose")

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected");
    }catch(err){
        console.log("mongodb connection failed :", err.message);
        process.exit(1);
    }
}

module.exports= connectDB;