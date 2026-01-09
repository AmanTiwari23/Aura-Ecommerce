import { useEffect, useState } from "react";
import api from "../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Payment</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="p-2 border">{order._id.slice(-6)}</td>
              <td className="p-2 border">{order.user.name}</td>
              <td className="p-2 border">₹{order.totalAmount}</td>
              <td className="p-2 border">{order.paymentMethod}</td>
              <td className="p-2 border">{order.orderStatus}</td>

              <td className="p-2 border">
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="border p-1"
                >
                  <option>Pending</option>
                  <option>Packed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
