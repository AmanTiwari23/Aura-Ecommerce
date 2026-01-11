import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiUsers, 
  FiBox, 
  FiDollarSign,
  FiArrowUpRight
} from "react-icons/fi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        toast.error("Failed to fetch real-time stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <DashboardSkeleton />;

  const statItems = [
    { 
      title: "Total Revenue", 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: <FiDollarSign />, 
      color: "bg-emerald-500",
      trend: "+12.5%" 
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders, 
      icon: <FiShoppingBag />, 
      color: "bg-blue-500",
      trend: "+8.2%" 
    },
    { 
      title: "Active Users", 
      value: stats.totalUsers, 
      icon: <FiUsers />, 
      color: "bg-purple-500",
      trend: "+5.1%" 
    },
    { 
      title: "Total Products", 
      value: stats.totalProducts, 
      icon: <FiBox />, 
      color: "bg-orange-500",
      trend: "Stable" 
    },
  ];

  return (
    <div className="animate-fadeIn">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Workspace Overview</h1>
        <p className="text-zinc-500 mt-1">Here is what's happening with Aura Menswear today.</p>
      </header>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statItems.map((item, index) => (
          <StatBox key={index} {...item} />
        ))}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-zinc-800">Sales Performance</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
              <FiTrendingUp /> Live
            </span>
          </div>
          <div className="h-64 bg-zinc-50 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-200">
             <p className="text-zinc-400 text-sm italic">Analytics Chart coming soon...</p>
          </div>
        </div>

        <div className="bg-black text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Inventory Alert</h3>
            <p className="text-zinc-400 text-sm">4 products are running low on stock. Restock soon to avoid losing sales.</p>
          </div>
          <button className="mt-6 w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors">
            Manage Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, icon, color, trend }) => (
  <div className="group bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl text-white ${color} shadow-lg shadow-${color}/20`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
        {trend}
      </span>
    </div>
    <div>
      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-black text-zinc-900 mt-1">{value}</h2>
        <FiArrowUpRight className="text-zinc-300 group-hover:text-black transition-colors" />
      </div>
    </div>
  </div>
);


const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 w-48 bg-zinc-200 rounded mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-zinc-200 rounded-2xl"></div>
      ))}
    </div>
  </div>
);

export default Dashboard;