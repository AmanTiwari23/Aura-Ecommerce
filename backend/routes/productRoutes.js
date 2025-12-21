const express = require("express");
const upload = require("../config/multer");

const {
    addProduct,
    getSingleProduct,
    getAllProducts,
} = require("../controllers/productController");

const { protect} = require("../middleware/authMiddleware");

const {adminOnly} = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/",protect,adminOnly,upload.array("images",5), addProduct);

router.get("/", getAllProducts);

router.get("/:id",getSingleProduct);

module.exports = router;