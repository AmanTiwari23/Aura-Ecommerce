import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { FiMail, FiArrowRight, FiChevronLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      // Redirect to reset page and pass email via state
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <Link to="/login" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black mb-8 transition-colors">
          <FiChevronLeft /> Back to Login
        </Link>
        
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Forgot Password?</h1>
        <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mb-8 leading-loose">
          Enter your email address and we'll send you a 6-digit code to reset your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-black transition-all rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:bg-zinc-200"
          >
            {loading ? "Sending..." : <>Send Reset Code <FiArrowRight /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;