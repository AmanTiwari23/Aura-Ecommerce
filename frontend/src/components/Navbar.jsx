import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FiShoppingBag, 
  FiHeart, 
  FiSearch, 
  FiLogOut, 
  FiGrid, 
  FiUser 
} from "react-icons/fi";
import toast from "react-hot-toast";

const Navbar = () => {
  
  const { user } = useSelector((state) => state.auth || {});
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems?.length;

  const logoutHandler = async () => {
    
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-black tracking-[0.25em] uppercase hover:opacity-70 transition-opacity">
          Aura
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/shop" 
            className={`text-xs font-bold uppercase tracking-widest transition-all ${
              isActive('/shop') ? 'text-black border-b-2 border-black pb-1' : 'text-zinc-400 hover:text-black'
            }`}
          >
            Collections
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex gap-5 items-center">
          
          <button className="text-zinc-800 hover:scale-110 transition-transform">
            <FiSearch size={20} />
          </button>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative group p-1" title="Wishlist">
            <FiHeart 
              size={20} 
              className={`transition-all duration-300 ${
                isActive('/wishlist') ? 'fill-black text-black' : 'text-zinc-800 group-hover:text-black'
              }`} 
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-bounce">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative group p-1" title="Shopping Bag">
            <FiShoppingBag size={20} className="text-zinc-800 group-hover:text-black transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User & Admin Section */}
          <div className="flex items-center gap-4 ml-2 pl-4 border-l border-zinc-100">
            {user ? (
              <div className="flex items-center gap-5">
                
                {/* DYNAMIC ADMIN LINK */}
                {user.role === "admin" && (
                  <Link 
                    to="/admin/dashboard" 
                    className="hidden lg:flex items-center gap-2 bg-zinc-100 text-zinc-900 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    <FiGrid size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Admin</span>
                  </Link>
                )}

                {/* Profile/Orders */}
                <Link to="/orders" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>

                <button 
                  onClick={logoutHandler} 
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-all"
                >
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;