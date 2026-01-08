import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    };

    fetchStats();
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox title="Orders" value={stats.totalOrders} />
        <StatBox title="Users" value={stats.totalUsers} />
        <StatBox title="Products" value={stats.totalProducts} />
        <StatBox title="Revenue" value={`₹${stats.totalRevenue}`} />
      </div>
    </div>
  );
};

const StatBox = ({ title, value }) => (
  <div className="bg-white p-6 shadow rounded">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default Dashboard;
