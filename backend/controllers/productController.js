const Product = require("../models/Product");
const Category = require("../models/Category");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      categories,
      description,
      price,
      discountPrice,
      colors,
      sizes,
      tags,
    } = req.body;

    // ✅ Parse JSON FIRST
    const parsedCategories = JSON.parse(categories);
    const parsedColors = JSON.parse(colors);
    const parsedSizes = JSON.parse(sizes);
    const parsedTags = tags ? JSON.parse(tags) : [];

    // ✅ Now validate
    if (
      !name ||
      !parsedCategories ||
      parsedCategories.length === 0 ||
      !description ||
      !price
    ) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ✅ Validate categories exist
    const categoryCount = await Category.countDocuments({
      _id: { $in: parsedCategories },
    });

    if (categoryCount !== parsedCategories.length) {
      return res
        .status(400)
        .json({ message: "One or more categories are invalid" });
    }

    const images = req.files ? req.files.map((file) => file.path) : [];

    const product = await Product.create({
      name,
      categories: parsedCategories,
      tags: parsedTags,
      description,
      price,
      discountPrice,
      colors: parsedColors,
      sizes: parsedSizes,
      images,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("categories", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "categories",
      "name"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductsByTag = async (req,res)=>{
  try{

    const tag = req.params.tag.toLowerCase();

    const products = await Product.find({
      tags: tag,
      isActive: true,
    })
      .populate("categories", "name")
      .sort({ createdAt: -1 });

    res.json(products);

  }catch(error){
    res.status(500).json({message:error.message})
  }
}

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getProductsByTag,
};
