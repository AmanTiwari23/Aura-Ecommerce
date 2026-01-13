import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { FiShield, FiLock, FiCheckCircle } from "react-icons/fi";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: location.state?.email || "", // Grab email from previous page state
    otp: "",
    newPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", formData);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or Expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-center">Reset Password</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email (Disabled - just for reference) */}
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full bg-zinc-100 border border-zinc-200 p-4 text-[11px] font-bold uppercase tracking-widest rounded-xl opacity-50 cursor-not-allowed"
          />

          {/* OTP Input */}
          <div className="relative group">
            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black" />
            <input
              type="text"
              maxLength="6"
              placeholder="6-DIGIT OTP"
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-black transition-all rounded-xl"
              value={formData.otp}
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              required
            />
          </div>

          {/* New Password */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black" />
            <input
              type="password"
              placeholder="NEW PASSWORD"
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-black transition-all rounded-xl"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:bg-zinc-200"
          >
            {loading ? "Resetting..." : <>Confirm New Password <FiCheckCircle /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;