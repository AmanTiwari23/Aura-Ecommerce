import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleWishlist } from "../redux/wishlistSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  return (
    <div className="border rounded overflow-hidden hover:shadow-lg transition">
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-64 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>

        <p className="text-gray-600 text-sm">{product.category?.name}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-lg">
            ₹{product.discountPrice || product.price}
          </span>

          {product.discountPrice && (
            <span className="line-through text-gray-400">₹{product.price}</span>
          )}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="block mt-4 text-center bg-black text-white py-2"
        >
          View Product
        </Link>
        <button
          onClick={() => dispatch(toggleWishlist(product._id))}
          className="absolute top-2 right-2 text-red-500"
        >
          ❤️
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
