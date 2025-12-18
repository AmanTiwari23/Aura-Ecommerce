const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { email, name, password,role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });
         
    const token = generateToken(user._id);

    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite: "Strict",
        maxAge: 7*24*60*60*1000
    });

    res.status(201).json({
        message:"User registerd succesfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
    })

  } catch (err) {
    res.status(500).json({msg:err.message});
  }
};

const loginUser = async (req,res)=>{
       try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(401).json({message:"Invalid email or password"});
        }

        if(user.isBlocked){
            return res.status(403).json({message:"user is blocked by admin"});

        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"});

        }

        const token = generateToken(user._id);

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
        });

        res.status(200).json({
            message:"Login successful",
            user :{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });

       }catch(err){
        res.status(500).json({message:err.message});
       }
};

const logoutUser = (req,res)=>{
    res.clearCookie("token");
    res.jason({message:"Logged out successfully"});
};

module.exports= {
    registerUser,
    loginUser,
    logoutUser,
}
