const Product = require("../models/Product");


const atomicUpdateStock = async(orderItems) =>{
    for(const item of orderItems){
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id:item.product,
                "sizes.size" : item.size,
                "sizes.stock" : {$gte:item.quantity}
            },

            {
                $inc : { "sizes.$.stock": -item.quantity},
            },
            {new:true}
        );

        if(!updatedProduct){
            throw new Error(
                `Insufficient stock for product ${item.product} size ${item.size}`
            );
        }

    }
}

module.exports = atomicUpdateStock;