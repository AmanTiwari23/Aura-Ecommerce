import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";
import { FiHeart, FiShoppingBag, FiArrowRight } from "react-icons/fi"; 
import toast from "react-hot-toast"; 

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

 
  const handleWishlist = () => {
    dispatch(toggleWishlist(product._id));
    toast.success("Wishlist Updated", {
      style: {
        borderRadius: '0px',
        background: '#000',
        color: '#fff',
        fontSize: '12px',
        letterSpacing: '1px'
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#000',
      },
    });
  };

  return (
    <div className="group relative bg-white border border-zinc-100 overflow-hidden transition-all duration-500 hover:shadow-2xl">
      
      <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-zinc-900 shadow-sm hover:bg-black hover:text-white transition-all duration-300 z-10"
        >
          <FiHeart size={18} />
        </button>

        {/* Discount Badge */}
        {product.discountPrice && (
          <div className="absolute top-4 left-0 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 z-10">
            Sale
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
            {product.category?.name || "Premium Collection"}
          </p>
          <h3 className="font-semibold text-zinc-900 text-base truncate tracking-tight">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-black text-lg text-zinc-900">
            ₹{(product.discountPrice || product.price).toLocaleString()}
          </span>

          {product.discountPrice && (
            <span className="line-through text-zinc-400 text-xs font-medium">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* View Product Action */}
        <Link
          to={`/product/${product._id}`}
          className="mt-6 flex items-center justify-center gap-2 w-full bg-black text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-zinc-800"
        >
          View Product <FiArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;