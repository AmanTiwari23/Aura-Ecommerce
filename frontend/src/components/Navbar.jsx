import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { 
  FiShoppingBag, 
  FiHeart, 
  FiSearch, 
  FiLogOut, 
  FiGrid, 
  FiX,
  FiUser,
  FiPackage,
  FiChevronDown
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

 
  useEffect(() => {
    setShowSearch(false);
  }, [location.pathname]);

  const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems?.length;

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
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-zinc-100 transition-all duration-300">
      
      
      {showSearch && (
        <div className="absolute inset-0 bg-white z-50 flex items-center px-6 animate-in fade-in zoom-in duration-200">
          <form onSubmit={handleSearch} className="w-full max-w-7xl mx-auto flex items-center gap-4">
            <FiSearch className="text-zinc-400" size={24} />
            <input 
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH PIECES..."
              className="flex-1 text-xl font-black uppercase tracking-widest placeholder:text-zinc-200 border-none outline-none bg-transparent h-20"
            />
            <button type="button" onClick={() => setShowSearch(false)} className="p-3 hover:bg-zinc-50 rounded-full">
              <FiX size={24} className="text-zinc-900" />
            </button>
          </form>
        </div>
      )}

    
      <div className={`max-w-7xl mx-auto px-6 h-20 flex justify-between items-center ${showSearch ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        
       
        <Link to="/" className="text-2xl font-black tracking-[0.25em] uppercase">
          Aura
        </Link>

        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`text-[10px] font-bold uppercase tracking-[0.2em] relative group ${isActive(link.path) ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          ))}
          
          
          {user && (
            <Link 
              to="/orders" 
              className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 relative group ${isActive('/my-orders') ? 'text-black' : 'text-zinc-400 hover:text-black'}`}
            >
              <FiPackage size={14} /> My Orders
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-black transition-all ${isActive('/my-orders') ? "w-full" : "w-0 group-hover:w-full"}`} />
            </Link>
          )}
        </div>

        
        <div className="flex gap-6 items-center">
          <button onClick={() => setShowSearch(true)} className="text-zinc-800 hover:text-black"><FiSearch size={20} /></button>

          <Link to="/wishlist" className="relative p-1">
            <FiHeart size={20} className="text-zinc-800 hover:text-black" />
            {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="relative p-1">
            <FiShoppingBag size={20} className="text-zinc-800 hover:text-black" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full">{cartCount}</span>}
          </Link>

          
          <div className="flex items-center gap-4 ml-2 pl-6 border-l border-zinc-100">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 group">
                  <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-100 text-black flex items-center justify-center text-[11px] font-black group-hover:border-black transition-all">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <FiChevronDown className="text-zinc-400 group-hover:text-black transition-colors" size={14} />
                </button>

                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-zinc-100 shadow-xl rounded-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {user.role === "admin" && (
                    <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 hover:text-black">
                      <FiGrid size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 hover:text-black">
                    <FiUser size={14} /> My Profile
                  </Link>
                  <div className="h-px bg-zinc-50 my-1"></div>
                  <button onClick={logoutHandler} className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black">Login</Link>
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