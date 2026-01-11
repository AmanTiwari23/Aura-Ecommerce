import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To access redirect state
  const { loading } = useSelector((state) => state.auth);

  // 1. Calculate where to send the user after login
  // If they came from a protected route, 'from' will be that route; otherwise Home.
  const from = location.state?.from?.pathname || "/";

  const submitForm = async (e) => {
    e.preventDefault();
    
    const loginToast = toast.loading("Authenticating...");
    
    const res = await dispatch(loginUser({ email, password }));
    
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Welcome back to Aura", { id: loginToast });
      
      // 2. Navigate to the intended destination
      navigate(from, { replace: true }); 
    } else {
      toast.error(res.payload || "Invalid credentials", { id: loginToast });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Sign In
          </h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            {from !== "/" ? `Login to continue to ${from.split('/')[1]}` : "Access your Aura account"}
          </p>
        </div>

        <form onSubmit={submitForm} className="space-y-6">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-black transition-colors">
              <FiMail size={18} />
            </div>
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl p-4 pl-12 text-sm transition-all outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-black transition-colors">
              <FiLock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl p-4 pl-12 text-sm transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-black transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          {/* Helper Links */}
          <div className="flex justify-between items-center px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-3 h-3 accent-black rounded" />
              <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Remember Me</span>
            </label>
            <button type="button" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-100 disabled:bg-zinc-400 group"
          >
            {loading ? "Verifying..." : "Login to Account"}
            {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-10 text-zinc-400 text-xs font-medium">
          New to the collection?{" "}
          <Link to="/register" className="text-black font-black uppercase tracking-widest hover:underline ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;