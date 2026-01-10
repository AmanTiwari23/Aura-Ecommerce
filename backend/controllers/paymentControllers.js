const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const User = require("../models/User");
const atomicUpdateStock = require("../utils/atomicUpdateStock");


const createRazorpayOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.product", "name images sizes price");

    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = user.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `aura_${Date.now()}`,
    });

    res.json(razorpayOrder);
  } catch (error) {
    console.error("Create Razorpay Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    // 🔥 Validate Razorpay fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment fields" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected.trim() !== razorpay_signature.trim()) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    const user = await User.findById(req.user._id).populate(
      "cart.product",
      "name images sizes price"
    );

    if (!user || !user.cart || user.cart.length === 0) {
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
      image: item.product.images?.[0],
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = user.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

   
    const order = await Order.create({
      user: user._id,
      orderItems,
      shippingAddress,
      paymentMethod: "Razorpay",
      totalAmount,
      isPaid: true,
      paidAt: Date.now(),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

   
    // await atomicUpdateStock(order.orderItems);

    
    user.cart = [];
    await user.save();

    res.json({ message: "Payment successful", order });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
