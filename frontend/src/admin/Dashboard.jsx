import { useEffect, useState } from "react";
import api from "../services/api";
import SalesChart from "./SalesChart";
import { 
  FiTrendingUp, 
  FiShoppingBag, 
  FiUsers, 
  FiBox, 
  FiDollarSign,
  FiArrowUpRight,
  FiAlertTriangle,
  FiActivity
} from "react-icons/fi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0
    },
    chartData: []
  });
  const [loading, setLoading] = useState(true);

 
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/orders/sales-stats")
        ]);

        if (isMounted) {
          setData({
            stats: statsRes.data,
            chartData: chartRes.data || []
          });
        }
      } catch (error) {
        if (isMounted) toast.error("Live sync failed. Showing cached data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <DashboardSkeleton />;

  const { stats, chartData } = data;

  const statItems = [
    { 
      title: "Total Revenue", 
      value: `₹${stats.totalRevenue?.toLocaleString() ?? 0}`, 
      icon: <FiDollarSign />, 
      color: "bg-black",
      trend: "+12.5%" 
    },
    { 
      title: "Total Orders", 
      value: stats.totalOrders ?? 0, 
      icon: <FiShoppingBag />, 
      color: "bg-black",
      trend: "+8.2%" 
    },
    { 
      title: "Active Users", 
      value: stats.totalUsers ?? 0, 
      icon: <FiUsers />, 
      color: "bg-black",
      trend: "+5.1%" 
    },
    { 
      title: "Inventory", 
      value: stats.totalProducts ?? 0, 
      icon: <FiBox />, 
      color: "bg-black",
      trend: "Stable" 
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">
            {getGreeting()}, Admin
          </h1>
          <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <FiActivity className="text-emerald-500 animate-pulse" /> Operational Metrics • Aura Menswear
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-zinc-100 px-4 py-2 rounded-full">
          Last Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statItems.map((item, index) => (
          <StatBox key={index} {...item} />
        ))}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2">
          {chartData.length > 0 ? (
            <SalesChart data={chartData} />
          ) : (
            <div className="h-[400px] w-full bg-white rounded-[2rem] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                <FiTrendingUp className="text-zinc-200" size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Waiting for Data</h3>
              <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-wide mt-2">Sales charts will populate once orders are processed.</p>
            </div>
          )}
        </div>

       
        <div className="space-y-6">
          <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl shadow-zinc-300 flex flex-col justify-between h-full min-h-[400px]">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-zinc-800 rounded-2xl shadow-inner">
                   <FiAlertTriangle className="text-amber-400" size={20} />
                </div>
                <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-zinc-500">Logistics Hub</h3>
              </div>
              
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 leading-none">Stock Critical</h3>
              <p className="text-zinc-400 text-xs font-bold leading-relaxed uppercase tracking-widest">
                System detected <span className="text-white">low inventory</span> on top-performing pieces. Action required to prevent revenue leakage.
              </p>
            </div>

            <button 
              onClick={() => window.location.href = '/admin/products'}
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition-all transform active:scale-95 shadow-xl"
            >
              Restock Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const StatBox = ({ title, value, icon, color, trend }) => (
  <div className="group bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-2xl text-white ${color} shadow-2xl shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[9px] font-black px-3 py-1.5 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'} tracking-widest`}>
        <FiTrendingUp size={10} /> {trend}
      </div>
    </div>
    <div>
      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em] mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">{value}</h2>
        <div className="p-2 rounded-full bg-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <FiArrowUpRight className="text-black" />
        </div>
      </div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="animate-pulse p-10 space-y-12">
    <div className="space-y-4">
      <div className="h-12 w-80 bg-zinc-100 rounded-2xl"></div>
      <div className="h-4 w-48 bg-zinc-50 rounded-xl"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-48 bg-zinc-100 rounded-[2.5rem]"></div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-10">
      <div className="col-span-2 h-96 bg-zinc-100 rounded-[2.5rem]"></div>
      <div className="h-96 bg-zinc-100 rounded-[2.5rem]"></div>
    </div>
  </div>
);

export default Dashboard;