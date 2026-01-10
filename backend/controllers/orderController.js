const Order = require("../models/Order");
const User = require("../models/User");
const atomicUpdateStock = require("../utils/atomicUpdateStock");

/* =============================
   PLACE ORDER (COD)
============================= */
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const user = await User.findById(req.user._id).populate(
      "cart.product",
      "name images sizes price"
    );

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Stock check
    for (const item of user.cart) {
      const sizes = item.product.sizes || [];
      const sizeObj = sizes.find((s) => s.size === item.size);

      if (!sizeObj || sizeObj.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name} (${item.size})`,
        });
      }
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

    const order = await Order.create({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      paymentStatus: paymentMethod === "COD" ? "Paid" : "Pending",
      orderStatus: "Placed",
    });

    if (paymentMethod === "COD") {
      await atomicUpdateStock(order.orderItems);
    }

    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   GET MY ORDERS
============================= */
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

/* =============================
   GET ALL ORDERS (ADMIN)
============================= */
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

/* =============================
   GET SINGLE ORDER
============================= */
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only owner or admin can view
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =============================
   UPDATE ORDER STATUS (ADMIN)
============================= */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
};
