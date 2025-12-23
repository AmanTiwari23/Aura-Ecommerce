const Product = require("../models/Product");


const updateStock = async (orderItems) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) continue;

    const sizeObj = product.sizes.find(
      (s) => s.size === item.size
    );

    if (sizeObj) {
      sizeObj.stock -= item.quantity;
      if (sizeObj.stock < 0) sizeObj.stock = 0;
    }

    await product.save();
  }
};

module.exports = updateStock;
