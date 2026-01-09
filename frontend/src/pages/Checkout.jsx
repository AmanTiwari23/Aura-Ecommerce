import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
    setShipping({
      ...shipping,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrderHandler = async () => {
  if (!items || items.length === 0) {
    alert("Cart is empty");
    return;
  }

  setLoading(true);

  try {
    // COD flow
    if (paymentMethod === "COD") {
      await api.post("/orders", {
        shippingAddress: shipping,
        paymentMethod: "COD",
      });

     navigate(`/order-success/${order._id}`);


      return;
    }

    // ONLINE PAYMENT FLOW

    // 1️⃣ Create Razorpay Order from CART
    const razorRes = await api.post("/payments/razorpay");

    const { id: razorpayOrderId, amount, currency } = razorRes.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Aura",
      description: "Aura Clothing Purchase",
      order_id: razorpayOrderId,

      handler: async function (response) {
        try {
          await api.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shippingAddress: shipping,
          });

          navigate(`/order-success/${res.data.order._id}`);

        } catch (err) {
          alert("Payment verification failed");
        }
      },

      prefill: {
        name: shipping.fullName,
        contact: shipping.mobile,
      },

      theme: {
        color: "#000000",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (err) {
    alert(err.response?.data?.message || "Checkout failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Shipping Address */}
      <div className="border p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Shipping Address
        </h2>

        {[
          ["fullName", "Full Name"],
          ["mobile", "Mobile Number"],
          ["addressLine", "Address"],
          ["city", "City"],
          ["state", "State"],
          ["pincode", "Pincode"],
        ].map(([name, label]) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            value={shipping[name]}
            onChange={changeHandler}
            className="w-full border p-2 mb-3"
          />
        ))}
      </div>

      {/* Payment Method */}
      <div className="border p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Payment Method
        </h2>

        <label className="block mb-2">
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />{" "}
          Cash on Delivery
        </label>

        <label className="block">
          <input
            type="radio"
            checked={paymentMethod === "ONLINE"}
            onChange={() => setPaymentMethod("ONLINE")}
          />{" "}
          Online Payment
        </label>
      </div>

      {/* Place Order */}
      <button
        onClick={placeOrderHandler}
        disabled={loading}
        className="w-full bg-black text-white py-3"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
