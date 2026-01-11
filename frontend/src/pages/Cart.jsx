import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCartQty, removeFromCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi"; // Modern Icons
import toast from "react-hot-toast"; 

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    dispatch(
      updateCartQty({
        productId: item.product._id,
        size: item.size,
        quantity: qty,
      })
    );
    toast.success("Quantity updated", { position: "bottom-right", duration: 1000 });
  };

  const removeItem = (item) => {
    dispatch(
      removeFromCart({
        productId: item.product._id,
        size: item.size,
      })
    );
    toast.error("Item removed from bag", { position: "bottom-right" });
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-6 bg-zinc-50 rounded-full">
          <FiShoppingBag size={48} className="text-zinc-300" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Your shopping bag is empty</h2>
        <p className="text-zinc-500 text-sm">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/shop" className="mt-4 bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-10">Shopping Bag ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          {items.map((item) => (
            <div
              key={item.product._id + item.size}
              className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-zinc-100 group"
            >
              {/* Image Container */}
              <div className="w-full sm:w-32 aspect-[3/4] bg-zinc-100 overflow-hidden">
                <img
                  src={item.product?.images?.[0] || "/placeholder.png"}
                  alt={item.product?.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wide text-zinc-900">{item.product.name}</h2>
                    <p className="text-[11px] text-zinc-400 font-bold uppercase mt-1 tracking-widest">
                      Size: <span className="text-zinc-900">{item.size}</span>
                    </p>
                  </div>
                  <p className="font-black text-sm">₹{item.price.toLocaleString()}</p>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between mt-6 sm:mt-0">
                  <div className="flex items-center border border-zinc-200">
                    <button
                      onClick={() => updateQty(item, item.quantity - 1)}
                      className="p-2 hover:bg-zinc-50 transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>

                    <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>

                    <button
                      onClick={() => updateQty(item, item.quantity + 1)}
                      className="p-2 hover:bg-zinc-50 transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item)}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-zinc-50 p-8 rounded-xl border border-zinc-100">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-zinc-900">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-zinc-200 flex justify-between">
                <span className="font-bold uppercase tracking-widest text-xs">Total</span>
                <span className="text-xl font-black">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            <p className="text-[10px] text-zinc-400 text-center mt-6 leading-relaxed">
              Shipping & taxes calculated at checkout • Secure Encrypted Payment
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;