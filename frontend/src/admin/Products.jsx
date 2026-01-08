import { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "./ProductForm";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <ProductForm
        product={editingProduct}
        onSuccess={() => {
          setEditingProduct(null);
          fetchProducts();
        }}
      />

      <table className="w-full mt-8 bg-white shadow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>
                <button
                  onClick={() => setEditingProduct(p)}
                  className="text-blue-500"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
