const User = require("../models/User");
const Product= require("../models/Product");

const addToCart = async (req,res)=>{
    try{
        const{productId,size,quantity} = req.body;

        if(!productId || !size || !quantity){
            return res.status(400).json({message:"Missing cart data"});

        }

        const product = await Product.findById(productId);

        if(!product){
            return res.status(400).json({message:"Product not found"});
        }

        const user = await User.findById(req.user._id);

        const existingItem = user.cart.find((item)=>item.product.toString()=== productId && item.size === size);

        if(existingItem){
            existingItem.quantity += quantity;
        }else{
            user.cart.push({
                product:productId,
                size,
                quantity,
                price:product.discountPrice || product.price,
            });
        }

        await user.save();

        res.status(200).json({
             message:"Item added to cart",
             cart:user.cart,
        });
        


    }catch(error){
        res.status(500).json({message:error.message});
    }
};


const getCart = async(req,res)=>{
    try{
        const user = await User.findById(req.user._id).populate("cart.product","name images price");
        res.json(user.cart);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};


const removeFromCart = async(req,res)=>{
    try{
        const {productId,size} = req.params;
        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter(
            (item)=> !(item.product.toString()===productId && item.size ===size)
        );

        await user.save();

        res.json({
            message:"Item removed from cart",
            cart:user.cart,
        });

    }catch(err){
        res.status(500).json({message: err.message});
    }
};


const updateCartQuantity = async(req,res)=>{
    try{
        const {productId,size,quantity} = req.body;
        const user = await User.findById(req.user._id);

        const item = user.cart.find( (i) => i.product.toString() === productId && i.size ===size);

        if(!item){
            return res.status(404).json({message:"Item not found in cart"});
        }

        item.quantity = quantity;
        await user.save();

        res.json({
            message:"cart updated",
            cart: user.cart,
        });
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports = {
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCart
}