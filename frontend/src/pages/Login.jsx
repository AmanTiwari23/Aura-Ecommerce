import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice"; // Importing your existing thunk
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from your auth slice
  const { user, loading, error } = useSelector((state) => state.auth);

  // 1. Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // 2. Handle Input Changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    // Dispatch the loginUser thunk from your slice
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success("Welcome back!");
      navigate("/"); // REDIRECT TO HOME
    } else {
      // Show the error message returned from thunkAPI.rejectWithValue
      toast.error(resultAction.payload || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full">
        {/* Branding/Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Sign In</h1>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            Enter your details to access Aura
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Email Field */}
          <div className="relative group">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="EMAIL ADDRESS"
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-black transition-all rounded-xl"
              required
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-black transition-colors" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="PASSWORD"
              className="w-full bg-zinc-50 border border-zinc-100 p-4 pl-12 text-[11px] font-bold uppercase tracking-widest outline-none focus:bg-white focus:border-black transition-all rounded-xl"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgot-password" size={18} className="text-[10px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:bg-zinc-200"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                Sign Into Account <FiArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-12 text-center pt-8 border-t border-zinc-100">
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
            Don't have an account?{" "}
            <Link to="/register" className="text-black hover:underline underline-offset-4 ml-1">
              Create One Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;