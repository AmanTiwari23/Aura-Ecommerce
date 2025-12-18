const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCategory, getAllCategories };
