import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice"; 
import { 
  FiGrid, 
  FiShoppingBag, 
  FiBox, 
  FiUsers, 
  FiLogOut, 
  FiChevronRight,
  FiArrowLeft,
  FiImage,      
  FiLayers      
} from "react-icons/fi";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname.startsWith(path);

  
  const logoutHandler = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Admin Session Ended");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
    { name: "Banners", path: "/admin/banners", icon: <FiImage /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingBag /> },
    { name: "Products", path: "/admin/products", icon: <FiBox /> },
    { name: "Categories", path: "/admin/categories", icon: <FiLayers /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
  ];


  const pathParts = location.pathname.split("/").filter(Boolean);
  const currentPathName = pathParts[pathParts.length - 1] || "Dashboard";
  const pageTitle = currentPathName.charAt(0).toUpperCase() + currentPathName.slice(1);

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans text-zinc-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-black text-white flex flex-col z-20 shadow-[10px_0_30px_rgba(0,0,0,0.05)]">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] uppercase font-black tracking-widest mb-10 group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform"/> Back to Store
          </Link>
          <h2 className="text-2xl font-black tracking-[0.2em] uppercase">
            Aura <span className="text-zinc-600 block text-[10px] tracking-[0.5em] mt-1">Management</span>
          </h2>
        </div>

        <nav className="flex-1 px-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-500 group ${
                    isActive(item.path)
                      ? "bg-white text-black shadow-xl translate-x-2"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xl transition-transform duration-500 ${isActive(item.path) ? "scale-110" : "group-hover:scale-110"}`}>
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                  </div>
                  {isActive(item.path) && <FiChevronRight className="text-black animate-pulse" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* --- ADMIN FOOTER --- */}
        <div className="p-8 border-t border-zinc-900 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/30 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xs font-black text-black uppercase shadow-lg">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black uppercase text-white tracking-tighter truncate">{user?.name}</p>
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Master Access</p>
            </div>
          </div>
          <button 
            onClick={logoutHandler}
            className="flex items-center justify-center gap-3 text-zinc-500 hover:text-white hover:bg-red-600/10 transition-all w-full py-4 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest"
          >
            <FiLogOut />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-zinc-100 flex items-center justify-between px-12 sticky top-0 z-10">
          <div className="flex items-center gap-3 text-zinc-400">
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Console</span>
            <FiChevronRight size={12} className="text-zinc-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
              {pageTitle}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end border-r border-zinc-100 pr-6">
              <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Database</span>
              <span className="text-[9px] text-emerald-500 font-black uppercase flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span> Synchronized
              </span>
            </div>
          </div>
        </header>

        
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;