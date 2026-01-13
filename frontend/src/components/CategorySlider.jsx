import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { FiTag, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    api.get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Could not load categories"));
  }, []);

  return (
    <div className="bg-white border-b border-zinc-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center relative group">
        
       
        <div className="hidden md:flex items-center gap-2 px-6 border-r border-zinc-100 text-zinc-400">
          <FiTag size={18} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Collections</span>
        </div>

        
        <div className="flex overflow-x-auto gap-3 py-4 px-6 no-scrollbar items-center">
          
          <button
            onClick={() => navigate("/shop")}
            className={`min-w-max px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 border ${
              !activeCategory 
                ? "bg-black text-white border-black shadow-lg" 
                : "bg-zinc-50 text-zinc-500 border-transparent hover:border-zinc-200"
            }`}
          >
            All Pieces
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => navigate(`/shop?category=${cat._id}`)}
              className={`min-w-max px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 border ${
                activeCategory === cat._id
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-zinc-50 text-zinc-500 border-transparent hover:border-zinc-200 hover:bg-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

       
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent pointer-events-none" />
      </div>

      
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CategorySlider;