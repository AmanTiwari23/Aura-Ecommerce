import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import FilterSidebar from "../components/FilterSidebar";
import { FiFilter, FiSearch } from "react-icons/fi";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  
  const [filters, setFilters] = useState({
    keyword: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    color: "",
    sort: "newest",
  });

  
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    const categoryQuery = searchParams.get("category");
    
   
    setFilters((prev) => ({
      ...prev,
      keyword: searchQuery || prev.keyword, 
      category: categoryQuery || prev.category
    }));
  }, [searchParams]); 

  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        
        if (filters.keyword) params.append("keyword", filters.keyword);
        if (filters.category) params.append("category", filters.category);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.color) params.append("color", filters.color);
        if (filters.sort) params.append("sort", filters.sort);

       

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      keyword: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      color: "",
      sort: "newest",
    });
   
    setSearchParams({});
  };

  return (
    <div className="bg-white min-h-screen">
      
      
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          
          
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter current results..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setShowSidebar(true)}
              className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-zinc-200 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
            >
              <FiFilter /> Filters
            </button>

            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        
       
        <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none lg:w-64 lg:block ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}>
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            clearFilters={clearFilters}
            closeSidebar={() => setShowSidebar(false)}
          />
        </aside>

        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold mb-2">No results found for "{filters.keyword}"</h3>
              <p className="text-zinc-500 mb-6">Try checking your spelling or use general terms.</p>
              <button onClick={clearFilters} className="text-xs font-black uppercase border-b-2 border-black">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;