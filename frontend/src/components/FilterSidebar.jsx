import { useEffect, useState } from "react";
import api from "../services/api";
import { FiX, FiCheck } from "react-icons/fi";

const FilterSidebar = ({ filters, setFilters, clearFilters, closeSidebar }) => {
  const [categories, setCategories] = useState([]);
  
  // Common colors for fashion apps
  const colors = ["Black", "White", "Navy", "Beige", "Red", "Green", "Grey"];

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-white w-full max-w-xs">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black uppercase tracking-tighter">Filters</h3>
        <button onClick={closeSidebar} className="lg:hidden text-zinc-400 hover:text-black">
          <FiX size={24} />
        </button>
      </div>

      {/* 1. Categories */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center gap-3">
              <input
                type="radio"
                name="category"
                value={cat._id}
                checked={filters.category === cat._id}
                onChange={handleInputChange}
                className="accent-black h-4 w-4 cursor-pointer"
              />
              <span className="text-sm text-zinc-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleInputChange}
            className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm rounded outline-none focus:border-black"
          />
          <span className="text-zinc-400">-</span>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleInputChange}
            className="w-full bg-zinc-50 border border-zinc-200 p-2 text-sm rounded outline-none focus:border-black"
          />
        </div>
      </div>

      {/* 3. Colors */}
      <div className="mb-8">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setFilters((prev) => ({ ...prev, color: c }))}
              className={`w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center transition-all ${
                filters.color === c ? "ring-2 ring-black ring-offset-2" : ""
              }`}
              style={{ backgroundColor: c.toLowerCase() }}
              title={c}
            >
              {filters.color === c && (
                <FiCheck className={`text-xs ${c === 'White' || c === 'Beige' ? 'text-black' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-3 bg-zinc-100 text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all rounded"
      >
        Clear All
      </button>
    </div>
  );
};

export default FilterSidebar;