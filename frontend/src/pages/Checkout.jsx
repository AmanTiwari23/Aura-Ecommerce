import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { FiLock, FiTruck, FiCreditCard, FiCheckCircle, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const [shipping, setShipping] = useState({
    fullName: "",
    mobile: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const verifyPayment = async (response) => {
    const loadingToast = toast.loading("Verifying payment security...");
    try {
      const verifyRes = await api.post("/payments/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        shippingAddress: shipping,
      });

      toast.success("Payment Verified! Creating your order...", { id: loadingToast });
      dispatch(clearCart());
      navigate(`/order-success/${verifyRes.data.order._id}`);
    } catch (err) {
      toast.error("Payment verification failed. Please contact support.", { id: loadingToast });
    }
  };

  const placeOrderHandler = async () => {
    if (!items || items.length === 0) {
      toast.error("Your cart is currently empty");
      return;
    }

    
    if (!shipping.fullName || !shipping.addressLine || !shipping.mobile) {
      toast.error("Please complete shipping details");
      return;
    }

    setLoading(true);
    const orderToast = toast.loading("Processing your request...");

    try {
      if (paymentMethod === "COD") {
        const res = await api.post("/orders", {
          shippingAddress: shipping,
          paymentMethod: "COD",
        });

        toast.success("Order Placed Successfully!", { id: orderToast });
        dispatch(clearCart());
        navigate(`/order-success/${res.data.order._id}`);
        return;
      }

     
      const razorRes = await api.post("/payments/razorpay");
      const { id, amount, currency } = razorRes.data;
      toast.dismiss(orderToast);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Aura Menswear",
        description: "Secure Checkout",
        order_id: id,
        handler: (res) => verifyPayment(res),
        prefill: { name: shipping.fullName, contact: shipping.mobile },
        theme: { color: "#000000" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout encountered an error", { id: orderToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Checkout</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Finalize your collection</p>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest border border-zinc-200 px-4 py-2 rounded-full bg-white">
            <FiLock className="text-emerald-500" /> Secure Encryption
          </div>
        </div>

        <div className="space-y-6">
          
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-black text-white rounded-lg"><FiTruck size={18} /></div>
              <h2 className="text-sm font-black uppercase tracking-widest">Delivery Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name", "text", "col-span-2"],
                ["mobile", "Mobile Number", "tel", "col-span-2 md:col-span-1"],
                ["pincode", "Pincode", "text", "col-span-2 md:col-span-1"],
                ["addressLine", "Complete Address", "text", "col-span-2"],
                ["city", "City", "text", "col-span-2 md:col-span-1"],
                ["state", "State", "text", "col-span-2 md:col-span-1"],
              ].map(([name, label, type, grid]) => (
                <div key={name} className={grid}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1 block ml-1">
                    {label}
                  </label>
                  <input
                    name={name}
                    type={type}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={shipping[name]}
                    onChange={changeHandler}
                    className="w-full bg-zinc-50 border-transparent focus:border-black focus:ring-0 rounded-xl p-4 text-sm transition-all outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-black text-white rounded-lg"><FiCreditCard size={18} /></div>
              <h2 className="text-sm font-black uppercase tracking-widest">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "COD", title: "Cash on Delivery", desc: "Pay when you receive" },
                { id: "ONLINE", title: "Online Payment", desc: "Cards, UPI, or NetBanking" }
              ].map((method) => (
                <label 
                  key={method.id}
                  className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === method.id 
                      ? "border-black bg-zinc-50" 
                      : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? "border-black" : "border-zinc-300"
                  }`}>
                    {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-900">{method.title}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          
          <button
            onClick={placeOrderHandler}
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:bg-zinc-400 group"
          >
            {loading ? "Initializing..." : "Complete Purchase"}
            {!loading && <FiChevronRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;