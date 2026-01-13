import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../redux/authSlice";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi"; 
import toast from "react-hot-toast"; 

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const submitForm = async (e) => {
    e.preventDefault();

    
    const registerToast = toast.loading("Creating your Aura profile...");

    const res = await dispatch(registerUser({ name, email, password }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Welcome to Aura, " + name + "!", { id: registerToast });
      navigate("/");
    } else {
      // Replaces the basic {error} display
      toast.error(res.payload || "Registration failed. Try again.", { id: registerToast });
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 bg-white">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">
            Join Aura
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
            Elevate your wardrobe today
          </p>
        </div>

        <form onSubmit={submitForm} className="space-y-5">
          
          {/* Name Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-black transition-colors">
              <FiUser size={18} />
            </div>
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl p-4 pl-12 text-sm transition-all outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              type="password"
              required
              placeholder="Create Password"
              className="w-full bg-zinc-50 border-none focus:ring-2 focus:ring-black rounded-xl p-4 pl-12 text-sm transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="text-[10px] text-zinc-400 leading-relaxed text-center px-4 uppercase font-medium tracking-tight">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-100 disabled:bg-zinc-400 group"
          >
            {loading ? "Creating Profile..." : "Create Account"}
            {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center mt-8 text-zinc-500 text-xs font-medium">
          Already a member?{" "}
          <Link to="/login" className="text-black font-black uppercase tracking-widest hover:underline ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;