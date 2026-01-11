import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FiPackage, FiCalendar, FiArrowRight, FiInfo, FiShoppingBag } from "react-icons/fi"; // Modern Icons
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to fetch your orders"))
      .finally(() => setLoading(false));
  }, []);

  // Helper to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Shipped": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-zinc-50 text-zinc-700 border-zinc-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading History</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="p-8 bg-zinc-50 rounded-full">
          <FiShoppingBag size={48} className="text-zinc-200" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight">No orders yet</h2>
          <p className="text-zinc-500 text-sm mt-1">When you shop, your order history will appear here.</p>
        </div>
        <Link to="/shop" className="bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
      <header className="mb-12">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">Purchase History</h1>
        <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest text-[10px] font-bold">Track and manage your Aura orders</p>
      </header>

      <div className="space-y-6">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="group bg-white border border-zinc-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl hover:shadow-zinc-100 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              
              {/* Order Meta Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-50 rounded-xl text-zinc-900">
                    <FiPackage size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Order Reference</p>
                    <p className="font-mono text-sm font-bold text-zinc-900">#{order._id.slice(-10).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <FiCalendar size={14} />
                    <span className="text-xs font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </div>
                </div>
              </div>

              {/* Financials & Action */}
              <div className="flex flex-row lg:flex-col justify-between items-end border-t lg:border-t-0 pt-6 lg:pt-0 border-zinc-50">
                <div className="text-left lg:text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Amount</p>
                  <p className="text-xl font-black text-zinc-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter mt-1">Via {order.paymentMethod}</p>
                </div>

                <Link
                  to={`/order-success/${order._id}`}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 hover:gap-4 transition-all"
                >
                  <FiInfo /> View Summary <FiArrowRight />
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;