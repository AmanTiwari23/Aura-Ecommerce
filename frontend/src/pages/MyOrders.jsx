import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-6">You have no orders yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p>
            Status:{" "}
            <span
              className={
                order.orderStatus === "Delivered"
                  ? "text-green-600"
                  : "text-orange-500"
              }
            >
              {order.orderStatus}
            </span>
          </p>
          <p>Payment: {order.paymentMethod}</p>
          <p>Total: ₹{order.totalAmount}</p>

          <Link
            to={`/order-success/${order._id}`}
            className="inline-block mt-2 text-blue-600 underline"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
