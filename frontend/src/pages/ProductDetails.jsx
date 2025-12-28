import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { addToCart } from "../redux/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    await dispatch(
      addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
      })
    );

    navigate("/cart");
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-[500px] object-cover"
      />

      {/* Details */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">
          {product.category?.name}
        </p>

        <div className="mt-4 text-2xl font-semibold">
          ₹{product.discountPrice || product.price}
        </div>

        <p className="mt-4">{product.description}</p>

        {/* Colors */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Color</h3>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-4 py-1 border ${
                  selectedColor === color
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Size</h3>
          <div className="flex gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={() => setSelectedSize(s.size)}
                className={`px-4 py-1 border ${
                  selectedSize === s.size
                    ? "bg-black text-white"
                    : ""
                } ${s.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Quantity</h3>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border px-3 py-1 w-20"
          />
        </div>

        {/* Add to Cart */}
        <button
          onClick={addToCartHandler}
          className="mt-6 w-full bg-black text-white py-3"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
