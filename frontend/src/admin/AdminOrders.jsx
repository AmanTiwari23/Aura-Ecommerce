import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { 
  FiPackage, 
  FiCreditCard, 
  FiClock, 
  FiTruck, 
  FiMoreHorizontal,
  FiXCircle
} from "react-icons/fi";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

 
  const updateStatus = async (id, status) => {
    const loadingToast = toast.loading(`Updating to ${status}...`);
    try {
      
      await api.put(`/orders/${id}`, { status });
      
      toast.success(`Order status: ${status}`, { id: loadingToast });
      fetchOrders(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed", { id: loadingToast });
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case "Placed": return "bg-zinc-100 text-zinc-600 border-zinc-200";
      case "Packed": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Shipped": return "bg-purple-50 text-purple-700 border-purple-100";
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Cancelled": return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">Order Management</h1>
          <p className="text-zinc-500 text-sm font-medium">Fulfill and track customer purchases</p>
        </div>
        <div className="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-zinc-200">
          Total Shipments: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Order ID</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Customer</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Total</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Status</th>
                <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400 text-right">Update</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-50">
              {loading ? (
                
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="p-6 h-16 bg-zinc-50/30"></td>
                  </tr>
                ))
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/80 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-400 group-hover:text-black transition-colors">
                          <FiPackage size={18} />
                        </div>
                        <span className="font-bold text-xs font-mono text-zinc-900 uppercase">
                          #{order._id.slice(-8)}
                        </span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-tight text-zinc-800">{order.user?.name}</span>
                        <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[150px]">{order.user?.email}</span>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-zinc-900">₹{order.totalAmount.toLocaleString()}</span>
                        <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400 flex items-center gap-1.5 mt-1">
                          <FiCreditCard size={10} /> {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-6 text-right">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="appearance-none bg-white border border-zinc-200 text-zinc-900 py-2.5 pl-4 pr-10 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black cursor-pointer hover:border-zinc-400 transition-all"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 border-l border-zinc-100 my-2">
                          <FiMoreHorizontal size={14} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !loading && (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
               <FiClock size={32} className="text-zinc-200" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tighter text-zinc-900">No Orders Yet</h3>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2">When customers buy, their shipments will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;