const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      enum: ["S", "M", "L", "XL", "XXL"],
      required: [true, "Size label is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    brand: {
      type: String,
      default: "Aura",
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "At least one category is required"],
      },
    ],
    tags: [{ type: String, lowercase: true, trim: true }],
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Discount price ({VALUE}) must be lower than original price",
      },
    },
    colors: [{ type: String, required: true }],
    images: {
      type: [String],
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one image is required",
      },
    },
    sizes: {
      type: [sizeSchema],
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one size with stock is required",
      },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: String,
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    numReviews: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


productSchema.index({ name: "text", tags: "text", brand: "text" });


productSchema.virtual("totalStock").get(function () {
  return this.sizes ? this.sizes.reduce((acc, item) => acc + item.stock, 0) : 0;
});


productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});



module.exports = mongoose.model("Product", productSchema);