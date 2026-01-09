import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, updateCartQty, removeFromCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const updateQty = (item, qty) => {
    if (qty < 1) return;
    dispatch(
      updateCartQty({
        productId: item.product._id,
        size: item.size,
        quantity: qty,
      })
    );
  };

  const removeItem = (item) => {
    dispatch(
      removeFromCart({
        productId: item.product._id,
        size: item.size,
      })
    );
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return <div className="p-6">Your cart is empty</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.map((item) => (
        <div
          key={item.product._id + item.size}
          className="flex gap-4 border-b py-4"
        >
          <img
            src={item.product?.images?.[0] || "/placeholder.png"}
            alt={item.product?.name}
            className="w-24 h-24 object-cover"
          />

          <div className="flex-1">
            <h2 className="font-semibold">{item.product.name}</h2>
            <p className="text-sm text-gray-600">Size: {item.size}</p>
            <p>₹{item.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => updateQty(item, item.quantity - 1)}
                className="px-2 border"
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() => updateQty(item, item.quantity + 1)}
                className="px-2 border"
              >
                +
              </button>

              <button
                onClick={() => removeItem(item)}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ₹{total}</h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-black text-white px-6 py-3"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
