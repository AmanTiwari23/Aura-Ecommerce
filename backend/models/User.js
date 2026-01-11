const mongoose =require("mongoose");
const bcrypt = require("bcryptjs");


const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);



const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"name is required"],
        trim:true,
    },
    email:{
        type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password:{
      type:String,
      required:[true,"Password is required"],
      minlength:6,
      selecte: false,
    },


    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },

    addresses: [addressSchema],

    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
    ],

    isBlocked:{
        type:Boolean,
        default:false,
    },
    cart: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
],

},
{
    timestamps:true,
});



userSchema.pre("save",async function (){
   
    if (!this.isModified("password")){
         return;
    }

    
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password,salt);


    


});


userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

const User = mongoose.model("User",userSchema);

module.exports = User;