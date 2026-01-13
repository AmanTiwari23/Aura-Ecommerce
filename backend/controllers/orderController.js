const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product"); 
const atomicUpdateStock = require("../utils/atomicUpdateStock");

//   Place new order
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
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid", 
      orderStatus: "Placed",
    });

    await atomicUpdateStock(order.orderItems);

    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get logged in user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//    Get all orders (Admin)
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

//     Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];
    
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid or missing status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;

    if (status === "Delivered") {
      order.paymentStatus = "Paid";
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json({ message: `Order marked as ${status}`, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   Get Sales Stats for Recharts (Last 7 Days)
//   GET /api/orders/sales-stats
const getSalesStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: "Cancelled" }, 
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ message: "Failed to generate sales stats" });
  }
};

//   Get Overall Dashboard Stats (Cards)
//   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    
    const orders = await Order.find({ orderStatus: { $ne: "Cancelled" } });
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
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
  getSalesStats,
  getAdminStats,
};