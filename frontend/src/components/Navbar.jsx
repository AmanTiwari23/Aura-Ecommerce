import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/authSlice"; // Import the logout thunk
import { 
  FiShoppingBag, 
  FiHeart, 
  FiSearch, 
  FiLogOut, 
  FiGrid, 
  FiX 
} from "react-icons/fi";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth || {});
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist || {});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close search overlay when navigating to a new page
  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems?.length;

  // --- UPDATED LOGOUT HANDLER ---
  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/shop?search=${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop All", path: "/shop" },
    { name: "New Drops", path: "/shop?tag=new-arrival" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-100 transition-all duration-300">
      
      {/* --- SEARCH OVERLAY --- */}
      {showSearch && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-6 animate-in fade-in zoom-in duration-200">
          <form onSubmit={handleSearch} className="w-full max-w-7xl mx-auto flex items-center gap-4">
            <FiSearch className="text-zinc-400" size={24} />
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH FOR PIECES..."
              className="flex-1 text-xl font-black uppercase tracking-widest placeholder:text-zinc-200 border-none outline-none bg-transparent h-20"
            />
            <button 
              type="button" 
              onClick={() => setShowSearch(false)}
              className="p-3 hover:bg-zinc-50 rounded-full transition-colors"
            >
              <FiX size={24} className="text-zinc-900" />
            </button>
          </form>
        </div>
      )}

      {/* --- MAIN NAVBAR --- */}
      <div className={`max-w-7xl mx-auto px-6 h-20 flex justify-between items-center ${showSearch ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        
        {/* LOGO */}
        <Link to="/" className="text-2xl font-black tracking-[0.25em] uppercase">
          Aura
        </Link>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group ${
                isActive(link.path.split('?')[0]) ? 'text-black' : 'text-zinc-400 hover:text-black'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all duration-300 ${
                isActive(link.path.split('?')[0]) ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        {/* ICONS & ACTIONS */}
        <div className="flex gap-6 items-center">
          
          <button 
            onClick={() => setShowSearch(true)} 
            className="text-zinc-800 hover:text-black transition-colors"
            aria-label="Search"
          >
            <FiSearch size={20} />
          </button>

          <Link to="/wishlist" className="relative group p-1" title="Wishlist">
            <FiHeart size={20} className="text-zinc-800 group-hover:text-black transition-colors" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative group p-1" title="Bag">
            <FiShoppingBag size={20} className="text-zinc-800 group-hover:text-black transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER SECTION */}
          <div className="flex items-center gap-4 ml-2 pl-6 border-l border-zinc-100">
            {user ? (
              <div className="flex items-center gap-5">
                {user.role === "admin" && (
                  <Link 
                    to="/admin/dashboard" 
                    className="hidden lg:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all shadow-sm"
                  >
                    <FiGrid size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
                  </Link>
                )}
                
                <Link to="/orders" className="group">
                  <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 text-black flex items-center justify-center text-[11px] font-black group-hover:border-black transition-all">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>

                <button 
                  onClick={logoutHandler} 
                  className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                  title="Logout"
                >
                  <FiLogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Login</Link>
                <Link to="/register" className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">Join</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;