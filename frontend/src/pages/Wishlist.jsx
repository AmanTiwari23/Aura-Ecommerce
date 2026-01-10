import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist } from "../redux/wishlistSlice";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  if (!items.length) return <p className="p-6">Your wishlist is empty</p>;

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((p) => (
        <Link to={`/product/${p._id}`} key={p._id}>
          <div className="border p-2">
            <img src={p.images[0]} className="h-40 w-full object-cover" />
            <h3>{p.name}</h3>
            <p>₹{p.discountPrice || p.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Wishlist;
