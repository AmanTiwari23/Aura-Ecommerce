import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import { FiFilter, FiSearch, FiPackage } from "react-icons/fi"; // Modern Icons
import toast from "react-hot-toast"; // Modern Notifications

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("Our collection is temporarily unavailable.");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-zinc-400 font-bold uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      {/* Page Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-zinc-900">
            Shop Collection
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Showing {filteredProducts.length} unique pieces
          </p>
        </div>

        {/* Search and Filter UI */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search pieces..."
              className="w-full bg-zinc-50 border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-zinc-900 text-white rounded-full hover:bg-black transition-colors shadow-lg shadow-zinc-200">
            <FiFilter size={18} />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <div className="p-6 bg-zinc-50 rounded-full mb-4">
            <FiPackage size={40} className="text-zinc-200" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 uppercase tracking-tight">No pieces found</h3>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest text-[10px]">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 animate-fadeIn">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;