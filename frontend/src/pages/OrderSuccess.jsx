import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import OrderTimeline from "../components/OrderTimeline";
import { FiCheckCircle, FiPrinter, FiShoppingBag, FiMapPin, FiCreditCard } from "react-icons/fi";
import toast from "react-hot-toast";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        // Only show success toast once on initial load
        toast.success("Order confirmed and secured", {
            icon: '✅',
            style: { borderRadius: '0px', background: '#000', color: '#fff' }
        });
      })
      .catch(() => toast.error("Could not retrieve order details"));
  }, [id]);

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Verifying Transaction</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-6">
            <FiCheckCircle size={32} />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">Thank You</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Your collection is being prepared</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tracking Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Order Tracking</h2>
                  <span className="font-mono text-xs font-bold text-zinc-900 tracking-tighter">#{order._id.toUpperCase()}</span>
               </div>
               <OrderTimeline status={order.orderStatus} />
            </div>

            {/* Items List */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-8">Purchase Summary</h2>
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex gap-6 items-center">
                    <div className="w-20 h-24 bg-zinc-100 flex-shrink-0 overflow-hidden rounded-lg">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{item.name}</h3>
                      <div className="flex gap-4 mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        <span>Size: <span className="text-zinc-900">{item.size}</span></span>
                        <span>Qty: <span className="text-zinc-900">{item.quantity}</span></span>
                      </div>
                    </div>
                    <p className="text-sm font-black text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Billing & Actions */}
          <div className="space-y-6">
            <div className="bg-black text-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-8 text-zinc-500">Invoice Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <FiMapPin className="text-zinc-500 mt-1" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Shipping To</p>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {order.shippingAddress.addressLine}, {order.shippingAddress.city}<br />
                      {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FiCreditCard className="text-zinc-500 mt-1" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Payment via</p>
                    <p className="text-xs text-zinc-300 font-bold">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-zinc-500">Total Paid</p>
                    <h3 className="text-2xl font-black">₹{order.totalAmount.toLocaleString()}</h3>
                  </div>
                  <button onClick={() => window.print()} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <FiPrinter size={18} />
                  </button>
                </div>
              </div>
            </div>

            <Link 
              to="/shop" 
              className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all shadow-sm"
            >
              <FiShoppingBag /> Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;