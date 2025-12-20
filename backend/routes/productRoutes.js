const express = require("express");

const {
    addProduct,
    getSingleProduct,
    getAllProducts,
} = require("../controllers/productController");

const { protect} = require("../middleware/authMiddleware");

const {adminOnly} = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",protect,adminOnly,addProduct);

router.get("/", getAllProducts);

router.get("/:id",getSingleProduct);

module.exports = router;