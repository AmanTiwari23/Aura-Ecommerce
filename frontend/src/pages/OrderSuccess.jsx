import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Order Placed Successfully
      </h1>

      <p className="mb-4">Order ID: {order._id}</p>
      <p className="mb-4">Payment: {order.paymentMethod}</p>

      <div className="border p-4">
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex gap-4 mb-4">
            <img src={item.image} className="w-20" />
            <div>
              <p>{item.name}</p>
              <p>Size: {item.size}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-4 text-xl font-bold">
        Total: ₹{order.totalAmount}
      </h2>
    </div>
  );
};

export default OrderSuccess;
