const User = require("../models/User");
const Product = require("../models/Product");

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    const exists = user.wishlist.includes(productId);

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

    await user.save();

    const populated = await User.findById(req.user._id)
      .populate("wishlist", "name images price discountPrice");

    res.json(populated.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist", "name images price discountPrice");

    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
