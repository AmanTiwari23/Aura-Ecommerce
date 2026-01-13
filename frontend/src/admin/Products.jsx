import { useEffect, useState } from "react";
import api from "../services/api";
import ProductForm from "./ProductForm";
import toast from "react-hot-toast";
import { 
  FiEdit3, 
  FiTrash2, 
  FiPlus, 
  FiPackage, 
  FiXCircle,
  FiSearch
} from "react-icons/fi";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Error loading inventory");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      const loadingToast = toast.loading("Removing product...");
      try {
        await api.delete(`/products/${id}`);
        toast.success("Product deleted", { id: loadingToast });
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete", { id: loadingToast });
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Inventory Master</h1>
          <p className="text-zinc-500 text-sm">Manage your menswear collection and stock levels.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setShowForm(!showForm); }}
          className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
        >
          {showForm ? <FiXCircle /> : <FiPlus />}
          {showForm ? "Close Editor" : "Add New Product"}
        </button>
      </div>

      
      {showForm && (
        <div className="mb-12 p-6 bg-zinc-50 rounded-3xl border border-zinc-200">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="font-bold text-lg">{editingProduct ? "Edit Product Details" : "New Collection Entry"}</h2>
          </div>
          <ProductForm
            product={editingProduct}
            onSuccess={() => {
              setEditingProduct(null);
              setShowForm(false);
              fetchProducts();
            }}
          />
        </div>
      )}

     
      <div className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input 
          type="text" 
          placeholder="Search inventory by name..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Product</th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Pricing</th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400">Stock Status</th>
              <th className="p-5 text-xs font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-zinc-50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiPackage className="w-full h-full p-3 text-zinc-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-zinc-400">SKU: {p._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-900">₹{p.price.toLocaleString()}</span>
                    {p.discountPrice && (
                      <span className="text-xs text-emerald-600 font-medium">Sale: ₹{p.discountPrice}</span>
                    )}
                  </div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-bold uppercase">
                    In Stock
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 hover:bg-black hover:text-white rounded-lg transition-all text-zinc-400"
                      title="Edit Product"
                    >
                      <FiEdit3 size={18} />
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all text-zinc-400"
                      title="Delete Product"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <FiPackage size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-500 font-medium">No products found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;