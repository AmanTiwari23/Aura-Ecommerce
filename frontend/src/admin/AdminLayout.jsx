import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

  const logoutHandler = () => {
    
    toast.success("Admin logged out");
    navigate("/login");
  };

 
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid /> },
    { name: "Banners", path: "/admin/banners", icon: <FiImage /> },
    { name: "Orders", path: "/admin/orders", icon: <FiShoppingBag /> },
    { name: "Products", path: "/admin/products", icon: <FiBox /> },
    { name: "Categories", path: "/admin/categories", icon: <FiLayers /> },
    { name: "Users", path: "/admin/users", icon: <FiUsers /> },
  ];

  const currentPathName = location.pathname.split("/").pop();
  const pageTitle = currentPathName.charAt(0).toUpperCase() + currentPathName.slice(1);

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
     
      <aside className="w-72 bg-black text-white flex flex-col z-20 shadow-2xl">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest mb-6">
            <FiArrowLeft /> Back to Store
          </Link>
          <h2 className="text-xl font-black tracking-[0.2em] uppercase">
            Aura <span className="font-light text-zinc-500">Admin</span>
          </h2>
        </div>

        <nav className="flex-1 px-6">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive(item.path)
                      ? "bg-white text-black shadow-lg translate-x-2"
                      : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  {isActive(item.path) && <FiChevronRight className="text-black" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

       
        <div className="p-8 border-t border-zinc-900 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white uppercase">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-white tracking-tighter truncate w-32">{user?.name}</p>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Master Admin</p>
            </div>
          </div>
          <button 
            onClick={logoutHandler}
            className="flex items-center gap-4 text-zinc-500 hover:text-red-400 transition-colors w-full px-4 py-3 bg-zinc-900/50 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

  
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-widest">Management</span>
            <FiChevronRight size={10} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black underline underline-offset-4 decoration-2">{pageTitle}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-zinc-900">System Status</span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Operational
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;