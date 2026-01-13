import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiShield, FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/auth/update-password", passwords);
      toast.success("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-16">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
      
        <div className="lg:col-span-1 bg-zinc-50 p-10 rounded-[2.5rem] h-fit sticky top-32">
          <div className="w-24 h-24 bg-black text-white rounded-4xl flex items-center justify-center text-4xl font-black mb-8 shadow-2xl shadow-zinc-300">
            {user?.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter">{user?.name}</h2>
            <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">{user?.role} Account</p>
          </div>
          
          <div className="mt-10 pt-10 border-t border-zinc-200 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-zinc-400"><FiMail/></div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-bold">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

    
        <div className="lg:col-span-2">
          <div className="mb-12">
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
              <FiShield className="text-zinc-300" /> Password & Security
            </h3>
            <p className="text-zinc-400 text-sm mt-2">Manage your password to keep your account secure.</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-lg">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Password</label>
              <input 
                type="password"
                required
                className="w-full bg-transparent border-b-2 border-zinc-100 py-4 font-bold focus:border-black outline-none transition-all"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">New Password</label>
              <input 
                type="password"
                required
                className="w-full bg-transparent border-b-2 border-zinc-100 py-4 font-bold focus:border-black outline-none transition-all"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              className="bg-black text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:bg-zinc-300"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;