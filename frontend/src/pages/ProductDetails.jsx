import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { addToCart } from "../redux/cartSlice";
import { 
  FiMinus, 
  FiPlus, 
  FiShoppingBag, 
  FiStar, 
  FiMessageSquare, 
  FiCheckCircle,
  FiArrowRight
} from "react-icons/fi"; // Modern Icons
import toast from "react-hot-toast"; // Modern Notifications

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

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("This product has moved or no longer exists.");
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = async () => {
    if (!user) {
      toast.error("Please login to add items to bag");
      navigate("/login");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast("Please select both size and color", { icon: '📏' });
      return;
    }

    const loadingToast = toast.loading("Adding to your collection...");
    await dispatch(
      addToCart({
        productId: product._id,
        size: selectedSize,
        quantity,
      })
    );
    toast.success("Added to Shopping Bag", { id: loadingToast });
    navigate("/cart");
  };

  const submitReview = async () => {
    try {
      await api.post(`/products/${product._id}/review`, {
        rating,
        comment,
      });
      toast.success("Thank you for your review!");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return <div className="p-20 text-center font-bold text-zinc-400 uppercase tracking-widest">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left: Cinematic Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden bg-zinc-100 rounded-2xl">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </div>
          {/* If you have more images, they would go here in a grid */}
        </div>

        {/* Right: Product Info (Sticky) */}
        <div className="lg:sticky lg:top-24 space-y-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">
              {product.category?.name}
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900 leading-none mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black">₹{(product.discountPrice || product.price).toLocaleString()}</span>
              {product.discountPrice && (
                <span className="text-lg line-through text-zinc-300">₹{product.price.toLocaleString()}</span>
              )}
            </div>
          </div>

          <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
            {product.description}
          </p>

          <div className="flex gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-bold bg-zinc-100 text-zinc-600 px-3 py-1 rounded-full uppercase tracking-widest">
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>

          <hr className="border-zinc-100" />

          {/* Color Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Select Color: <span className="text-zinc-400 font-bold ml-2">{selectedColor}</span></h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                    selectedColor === color 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Select Size:</h3>
            <div className="flex gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSelectedSize(s.size)}
                  className={`w-12 h-12 text-[10px] font-black uppercase border transition-all flex items-center justify-center ${
                    selectedSize === s.size 
                      ? "bg-black text-white border-black shadow-lg" 
                      : "bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black"
                  } ${s.stock === 0 ? "opacity-20 cursor-not-allowed bg-zinc-50" : ""}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize && <p className="text-[10px] text-emerald-600 font-bold uppercase"><FiCheckCircle className="inline mr-1"/> Size is in stock</p>}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex items-center border border-zinc-200 h-14">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 h-full hover:bg-zinc-50 transition-colors"
              >
                <FiMinus size={14} />
              </button>
              <span className="w-12 text-center font-bold text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 h-full hover:bg-zinc-50 transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
            
            <button
              onClick={addToCartHandler}
              className="flex-1 bg-black text-white h-14 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              <FiShoppingBag /> Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32 border-t border-zinc-100 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Write a Review */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Share Your Thoughts</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => setRating(num)}
                      className={`transition-colors ${rating >= num ? 'text-zinc-900' : 'text-zinc-200'}`}
                    >
                      <FiStar size={20} fill={rating >= num ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How does it fit? Quality of fabric?"
                className="w-full bg-zinc-50 border-none rounded-2xl p-6 text-sm outline-none focus:ring-2 focus:ring-black h-32 transition-all"
              />

              <button
                onClick={submitReview}
                className="w-full bg-black text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                Submit Review <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <FiMessageSquare /> Customer Experience ({product.numReviews})
            </h3>

            {product.reviews.length === 0 ? (
              <p className="text-zinc-400 text-sm italic py-10">Be the first to review this piece.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {product.reviews.map((r) => (
                  <div key={r._id} className="py-8 first:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold uppercase tracking-tight">{r.name}</p>
                      <div className="flex gap-0.5 text-zinc-900">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i >= r.rating ? "text-zinc-200" : ""} />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;