const express = require("express");
const {protect} = require("../middleware/authMiddleware");

const {addToCart,getCart,removeFromCart,updateCartQuantity} = require("../controllers/cartController");

const router = express.Router();

router.post("/",protect,addToCart);
router.get("/",protect,getCart);
router.delete("/:productId/:size",protect,removeFromCart);
router.put("/",protect,updateCartQuantity);


module.exports = router;