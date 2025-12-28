import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await dispatch(logoutHandler());
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b ">
      <Link to="/" className="text-2xl font-bold">
        Aura
      </Link>

      <div className="flex gap-4 items-center">
        <Link to="/shop">Shop</Link> 
        {user ? (
            <>
            <span className="text-sm ">Hi, {user.name}</span>
            <Link to="/orders">Orders</Link>

            {user.role === "admin" && (
                <Link to="/admin/dashboard">Admin</Link>
            )}

            <button onClick={logoutHandler} className="border px-3 py-1">
                Logout
            </button>
            </>
        ) :(
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
