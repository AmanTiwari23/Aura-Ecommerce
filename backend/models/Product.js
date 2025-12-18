const mongoose = require("mongoose");
const Category = require("./Category");

const sizeSchema = new mongoose.Schema(
    {
        size:{
            type:String,
            enum: ["S","M","L","XL","XXL"],
            required:true,
        },
        stock: {
            type:Number,
            required:true,
            min:0,
        },
    },
    {_id:false}
);


const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },

        brand:{
            type:String,
            default:"Aura",
        },

        Category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true,
        },

        description:{
            type : String,
            required : true,
        },

        price:{
            type:Number,
            required:true,
        },

        discountPrice: {
            type: Number,

        },

        colors:[
            {
                type:String,
                required:true,
            },
        ],

        images:[
            {
                type:String,
            },
        ],

        isActive: {
            type:Boolean,
            default:true
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model("Product",productSchema);