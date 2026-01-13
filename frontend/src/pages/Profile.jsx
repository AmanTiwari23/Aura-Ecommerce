import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiShield } from "react-icons/fi";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/profile/password", passwords);
      toast.success("Password updated!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* User Info Card */}
        <div className="md:col-span-1 bg-zinc-50 p-8 rounded-[2rem] h-fit">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black mb-6">
            {user?.name.charAt(0)}
          </div>
          <h2 className="text-xl font-black uppercase tracking-tighter">{user?.name}</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">{user?.role}</p>
          <div className="mt-8 pt-8 border-t border-zinc-200 space-y-4">
            <div className="flex items-center gap-3 text-zinc-600">
              <FiMail /> <span className="text-sm">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-2">
            <FiShield /> Security Settings
          </h3>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-zinc-400">Current Password</label>
              <input 
                type="password"
                className="w-full border-b-2 border-zinc-100 py-3 outline-none focus:border-black transition-all font-bold"
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-zinc-400">New Password</label>
              <input 
                type="password"
                className="w-full border-b-2 border-zinc-100 py-3 outline-none focus:border-black transition-all font-bold"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              />
            </div>
            <button className="bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 rounded-full transition-all">
              Update Security
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;