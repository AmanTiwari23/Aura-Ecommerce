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
    const { 
      keyword, 
      category, 
      tag, 
      minPrice, 
      maxPrice, 
      color, 
      sort 
    } = req.query;

    let query = {};

    // 1. Search (Name or Description)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 2. Filter by Category
    if (category) {
      query.categories = category;
    }

    // 3. Filter by Tag
    if (tag) {
      query.tags = { $in: [tag] }; // Matches if product has this tag
    }

    // 4. Filter by Color
    if (color) {
      // Assumes colors are stored as strings e.g., ["Red", "Blue"]
      query.colors = { $regex: new RegExp(color, "i") }; 
    }

    // 5. Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 6. Sorting Logic
    let sortOptions = { createdAt: -1 }; // Default: Newest first

    if (sort === "price_asc") {
      sortOptions = { price: 1 }; // Low to High
    } else if (sort === "price_desc") {
      sortOptions = { price: -1 }; // High to Low
    } else if (sort === "rating") {
      sortOptions = { rating: -1 }; // Best rated first (assuming you have a rating field)
    } else if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    }

    // Execute Query
    const products = await Product.find(query)
      .populate("categories", "name")
      .sort(sortOptions);

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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


const updateProduct = async (req, res) => {
  try {
    const { name, price, description, categories, tags, colors, sizes, discountPrice } = req.body;
    
    // 1. Find the product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Helper to safely parse JSON strings from FormData
    const safeParse = (data) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch (e) {
        return data ? data.split(",") : [];
      }
    };

    // 3. Update Text Fields
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.discountPrice = discountPrice || 0;

    // 4. Update Arrays (Only if data is sent)
    if (categories) product.categories = safeParse(categories);
    if (tags) product.tags = safeParse(tags);
    if (colors) product.colors = safeParse(colors);
    if (sizes) product.sizes = safeParse(sizes);

    // 5. Update Images (Only if new files are uploaded)
    // If user uploaded new images, we replace the old ones. 
    // If you want to append, use: [...product.images, ...newPaths]
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path || file.secure_url);
      product.images = newImages; 
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  getProductsByTag,
  deleteProduct,
  updateProduct,
};