import { useEffect, useState } from "react";
import api from "../services/api";
import { FiTrash2, FiPlus, FiTag, FiAlertTriangle } from "react-icons/fi"; 
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    
    const toastId = toast.loading("Creating category...");

    try {
      setLoading(true);
      await api.post("/categories", { name: newCategory });
      
   
      toast.success("Category created!", { id: toastId });
      
      setNewCategory("");
      fetchCategories(); 
    } catch (error) {
     
      toast.error(error.response?.data?.message || "Failed to create category", { id: toastId });
    } finally {
      setLoading(false);
    }
  };


  const deleteHandler = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-bold text-sm text-zinc-800">
          <FiAlertTriangle className="text-red-600" />
          Delete this category?
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => {
              confirmDelete(id);
              toast.dismiss(t.id);
            }}
            className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-red-700 font-bold transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-zinc-100 text-zinc-600 text-xs px-3 py-1.5 rounded-md hover:bg-zinc-200 font-bold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { 
      duration: 5000,
      position: "top-center",
      style: {
        background: '#fff',
        border: '1px solid #e4e4e7',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        borderRadius: '12px'
      }
    });
  };

  
  const confirmDelete = async (id) => {
    const toastId = toast.loading("Deleting...");
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted", { id: toastId });
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category", { id: toastId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <FiTag size={28} />
        <h1 className="text-3xl font-black uppercase tracking-tighter">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        
        <div className="bg-zinc-50 p-8 rounded-4xl h-fit">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Add New</h2>
          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-zinc-500">Category Name</label>
              <input 
                type="text" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white border border-zinc-200 p-4 font-bold focus:outline-none focus:border-black transition-colors rounded-xl"
                placeholder="e.g. Oversized Tees"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white p-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 rounded-xl"
            >
              {loading ? "Creating..." : <><FiPlus size={16} /> Create Category</>}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Existing Collections</h2>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat._id} className="flex justify-between items-center bg-white border border-zinc-100 p-4 rounded-xl group hover:border-zinc-900 transition-all">
                <span className="font-bold text-sm uppercase tracking-wide">{cat.name}</span>
                <button 
                  onClick={() => deleteHandler(cat._id)}
                  className="text-zinc-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="Delete Category"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-8 text-center bg-zinc-50 rounded-xl text-zinc-400 text-sm italic">
                No categories found. Start adding some!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminCategories;