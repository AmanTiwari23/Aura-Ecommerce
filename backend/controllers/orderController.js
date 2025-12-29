const Order = require("../models/Order");
const User = require("../models/User");
const atomicUpdateStock = require("../utils/atomicUpdateStock");
const updateStock = require("../utils/updateStock");

const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const user = await User.findById(req.user._id).populate("cart.product");
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    for (const item of user.cart) {
  const product = await Product.findById(item.product);
  const sizeObj = product.sizes.find(s => s.size === item.size);

  if (!sizeObj || sizeObj.stock < item.quantity) {
    return res.status(400).json({
      message: `Insufficient stock for ${product.name} (${item.size})`
    });
  }
}


    const order = await Order.create({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    if (paymentMethod === "COD") {
      await atomicUpdateStock(order.orderItems);
    }
    // Clear cart after order
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateOrderStatus,
  getAllOrders,
  placeOrder,
  getMyOrders,
};
