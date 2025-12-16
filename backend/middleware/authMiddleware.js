const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req,res,next)=>{
    try{
        let token;

        if(req.cookies && req.cookies.token){
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({message:"not authorized, no token"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if(!req.user){
            return res.status(403).json({message:"User is blocked"});
        }

        if(req.user.isBlocked){
             return res.status(403).json({message:"User is Blocked"});

        }
        next();
    }catch (err){
        res.status(401).json({message:"Not authorized token faild"});
    }
};

module.exports = {protect};