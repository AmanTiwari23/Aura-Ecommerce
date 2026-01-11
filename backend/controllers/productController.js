const Product = require("../models/Product");
const Category = require("../models/Category");

const addProduct = async (req, res) => {
  console.log("👉 1. Controller Started"); 

  try {
    
    console.log("👉 2. Request Body:", req.body);
    console.log("👉 3. Request Files:", req.files);

    const { name, price, discountPrice, description, categories, tags, colors, sizes } = req.body;

    
    const safeParse = (data, fieldName) => {
      try {
        if (!data) return [];
        if (typeof data === "object") return data; 
        return JSON.parse(data);
      } catch (e) {
        console.log(`⚠️ Warning: Could not JSON parse ${fieldName}, using split fallback.`);
        return typeof data === "string" ? data.split(",").map(i => i.trim()) : [];
      }
    };

    console.log("👉 4. Parsing Data...");
    const parsedCategories = safeParse(categories, "categories");
    const parsedSizes = safeParse(sizes, "sizes");
    const parsedTags = safeParse(tags, "tags");
    const parsedColors = safeParse(colors, "colors");

    
    console.log("👉 5. Validating...");
    if (!name || !price || !description) throw new Error("Missing Name, Price, or Description");
    if (parsedSizes.length === 0) throw new Error("Sizes are required (e.g. [{size:'M', stock:10}])");

    
    console.log("👉 6. Processing Images...");
    const imagePaths = req.files ? req.files.map(file => file.path || file.secure_url) : [];

  
    console.log("👉 7. Saving to MongoDB...");
    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      categories: parsedCategories,
      tags: parsedTags,
      colors: parsedColors,
      sizes: parsedSizes,
      images: imagePaths
    });

    console.log("✅ 8. Success!");
    res.status(201).json({ message: "Product created!", product: newProduct });

  } catch (error) {
    console.error("❌ CRASH AT STEP:", error.message);
    
    res.status(500).json({ message: error.message, stack: error.stack });
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
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); 
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getProductsByTag,
  deleteProduct,
};