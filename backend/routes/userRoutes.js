const express = require("express");
const { protect} = require("../middleware/authMiddleware"); 
const {adminOnly} = require("../middleware/adminMiddleware")
const { getAllUsers } = require("../controllers/userController"); 

const router = express.Router();


router.get("/profile", protect, (req, res) => {
    res.json({
        message: "User profile fetched successfully",
        user: req.user,
    });
});

router.get("/", protect, adminOnly, getAllUsers);

module.exports = router;