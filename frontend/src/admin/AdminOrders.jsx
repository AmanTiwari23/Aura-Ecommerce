import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { 
  FiPackage, 
  FiUser, 
  FiCreditCard, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiMoreHorizontal 
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
    const loadingToast = toast.loading("Updating status...");
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success(`Order marked as ${status}`, { id: loadingToast });
      fetchOrders();
    } catch (error) {
      toast.error("Update failed", { id: loadingToast });
    }
  };

  
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "packed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Order Management</h1>
          <p className="text-zinc-500 text-sm">Manage and track your customer shipments</p>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="p-4 text-xs uppercase tracking-wider font-semibold text-zinc-500">Order Info</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold text-zinc-500">Customer</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold text-zinc-500">Amount</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold text-zinc-500">Status</th>
              <th className="p-4 text-xs uppercase tracking-wider font-semibold text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-50">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-zinc-50 transition-colors group">
               
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 rounded-lg group-hover:bg-white transition-colors">
                      <FiPackage className="text-zinc-600" />
                    </div>
                    <span className="font-mono text-sm font-medium text-zinc-900 uppercase">
                      #{order._id.slice(-6)}
                    </span>
                  </div>
                </td>

                
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800">{order.user.name}</span>
                    <span className="text-xs text-zinc-400">Customer ID: {order.user._id.slice(-4)}</span>
                  </div>
                </td>

                
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-zinc-900">₹{order.totalAmount.toLocaleString()}</span>
                    <span className="text-[10px] uppercase tracking-tight text-zinc-400 flex items-center gap-1">
                      <FiCreditCard size={10} /> {order.paymentMethod}
                    </span>
                  </div>
                </td>

                
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusStyle(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>

                
                <td className="p-4 text-right">
                  <div className="relative inline-block text-left">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="appearance-none bg-zinc-100 border border-zinc-200 text-zinc-700 py-1.5 px-4 pr-8 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black cursor-pointer hover:bg-zinc-200 transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                   
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                      <FiMoreHorizontal size={14} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && !loading && (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <FiClock size={40} className="text-zinc-200 mb-4" />
            <p className="text-zinc-400">No orders found in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;