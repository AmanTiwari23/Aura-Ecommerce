import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, toggleWishlist } from "../redux/wishlistSlice"; // Assuming toggle handles removal
import { Link } from "react-router-dom";
import { FiHeart, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(toggleWishlist(productId));
    toast.error("Removed from collection", {
      style: { borderRadius: '0px', background: '#333', color: '#fff', fontSize: '12px' }
    });
  };

  if (!items.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="p-10 bg-zinc-50 rounded-full mb-6">
          <FiHeart size={48} className="text-zinc-200" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">Your collection is empty</h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-xs text-center leading-relaxed">
          Save your favorite pieces here to keep track of what you love.
        </p>
        <Link to="/shop" className="mt-8 bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-zinc-100 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">
            My Collection
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            {items.length} Curated Pieces
          </p>
        </div>
        <button className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
          Share Wishlist <FiArrowRight />
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {items.map((p) => (
          <div key={p._id} className="group relative bg-white">
            
            {/* Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 rounded-2xl shadow-sm">
              <Link to={`/product/${p._id}`}>
                <img 
                  src={p.images[0]} 
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </Link>

              {/* Quick Remove Button */}
              <button 
                onClick={() => handleRemove(p._id)}
                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-zinc-900 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
                title="Remove from Wishlist"
              >
                <FiTrash2 size={16} />
              </button>
            </div>

            {/* Info Section */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-start">
                <Link to={`/product/${p._id}`}>
                  <h3 className="text-sm font-bold uppercase tracking-tight text-zinc-900 group-hover:text-zinc-500 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    {p.category?.name || "Collection"}
                  </p>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-black text-zinc-900">
                  ₹{(p.discountPrice || p.price).toLocaleString()}
                </p>
                <Link 
                  to={`/product/${p._id}`}
                  className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-900 border-b border-black pb-0.5"
                >
                  <FiShoppingBag size={12} /> Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;