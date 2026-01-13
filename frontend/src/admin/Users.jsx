import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { 
  FiUsers, 
  FiMail, 
  FiShield, 
  FiTrash2, 
  FiSearch, 
  FiUserCheck 
} from "react-icons/fi";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (error) {
        toast.error("Failed to load user directory");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">User Directory</h1>
          <p className="text-zinc-500 text-sm">Manage customer accounts and administrative permissions.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold">
          <FiUserCheck /> {users.length} Total Members
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search by name or email address..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-100 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400">User Info</th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Role</th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-zinc-50 transition-colors group">
                {/* User Avatar & Name */}
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{user.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-tighter">ID: {user._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="p-5 text-sm text-zinc-600 font-medium">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-zinc-300" />
                    {user.email}
                  </div>
                </td>

                {/* Role Badge */}
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    user.role === 'admin' 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-zinc-500 border-zinc-200"
                  }`}>
                    <FiShield size={10} />
                    {user.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-5 text-right">
                  <button 
                    onClick={() => toast.error(`Action restricted: Cannot delete ${user.name}`)}
                    className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && !loading && (
          <div className="py-20 text-center">
            <FiUsers size={40} className="mx-auto text-zinc-200 mb-2" />
            <p className="text-zinc-500 font-medium">No users match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;