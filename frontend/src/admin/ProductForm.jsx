import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { FiUpload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const ProductForm = ({ product, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    description: "",
    categories: [],
    tags: "",
    colors: "",
    sizes: '[{"size":"M","stock":10}]', 
    images: [],
  });

  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || "",
        description: product.description,
        categories: product.categories.map((c) => c._id),
        tags: product.tags.join(", "),
        colors: product.colors.join(", "),
        sizes: JSON.stringify(product.sizes), 
        images: [], 
      });
    }
  }, [product]);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Saving product...");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("price", form.price);
      data.append("discountPrice", form.discountPrice || 0);
      data.append("description", form.description);

     
      data.append("categories", JSON.stringify(form.categories));

      
      try {
        const parsedSizes = JSON.parse(form.sizes);
        if (!Array.isArray(parsedSizes)) throw new Error();
        data.append("sizes", form.sizes); 
      } catch (err) {
        throw new Error('Sizes must be valid JSON: [{"size":"M","stock":10}]');
      }

      
      const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(t => t !== "");
      data.append("tags", JSON.stringify(tagsArray));

      const colorsArray = form.colors.split(",").map((c) => c.trim()).filter(c => c !== "");
      data.append("colors", JSON.stringify(colorsArray));

     
      if (form.images && form.images.length > 0) {
        for (let file of form.images) {
          data.append("images", file);
        }
      }

     
      if (product) {
        await api.put(`/products/${product._id}`, data);
      } else {
        await api.post("/products", data);
      }

      toast.success("Product Saved Successfully!", { id: loadingToast });
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Frontend Submit Error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Something went wrong";
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const inputClasses = "w-full bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all";

  return (
    <form onSubmit={submitHandler} className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-zinc-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 mb-1 block">Product Name</label>
            <input name="name" placeholder="e.g. Oversized Hoodie" value={form.name} onChange={changeHandler} className={inputClasses} required />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 mb-1 block">Description</label>
            <textarea name="description" placeholder="Product details..." value={form.description} onChange={changeHandler} className={`${inputClasses} h-32 resize-none`} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 mb-1 block">Price (₹)</label>
              <input name="price" type="number" placeholder="2999" value={form.price} onChange={changeHandler} className={inputClasses} required />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 mb-1 block">Discount (₹)</label>
              <input name="discountPrice" type="number" placeholder="Optional" value={form.discountPrice} onChange={changeHandler} className={inputClasses} />
            </div>
          </div>

          <div className="border-2 border-dashed border-zinc-200 p-8 rounded-2xl flex flex-col items-center justify-center relative hover:bg-zinc-50 transition-colors cursor-pointer group">
             <input type="file" multiple onChange={(e) => setForm({ ...form, images: e.target.files })} className="absolute inset-0 opacity-0 cursor-pointer" />
             <FiUpload className="text-zinc-300 group-hover:text-black mb-3 transition-colors" size={28} />
             <span className="text-[10px] font-bold uppercase text-zinc-400 group-hover:text-black">
               {form.images.length > 0 ? `${form.images.length} Images Selected` : "Click to Upload Images"}
             </span>
          </div>
        </div>

        
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 mb-1 block">Categories (Select Multiple)</label>
            <select multiple value={form.categories} onChange={(e) => setForm({ ...form, categories: Array.from(e.target.selectedOptions, (o) => o.value) })} className={`${inputClasses} h-32`}>
              {categories.map((c) => (
                <option key={c._id} value={c._id} className="p-2 mb-1 rounded hover:bg-zinc-200 cursor-pointer text-xs font-medium">{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 mb-1 block">Attributes</label>
            <div className="space-y-3">
              <input name="tags" placeholder="Tags: New, Summer, Cotton" value={form.tags} onChange={changeHandler} className={inputClasses} />
              <input name="colors" placeholder="Colors: Black, Navy, White" value={form.colors} onChange={changeHandler} className={inputClasses} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 block">Sizes (JSON Format)</label>
              <FiAlertCircle className="text-zinc-300" size={12} title='Format: [{"size":"S", "stock":10}]' />
            </div>
            <textarea 
              name="sizes" 
              value={form.sizes} 
              onChange={changeHandler} 
              className={`${inputClasses} font-mono text-[11px] h-24 bg-zinc-900 text-zinc-300 border-zinc-900`} 
              placeholder='[{"size":"M","stock":10}]'
            />
            
            <p className="text-[9px] text-zinc-400 mt-1.5 ml-1">Example: <code className="bg-zinc-100 px-1 rounded">{'[{"size":"M","stock":10}, {"size":"L","stock":5}]'}</code></p>
          </div>

          <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-800 transition-all flex justify-center items-center gap-2 shadow-xl mt-4">
            {product ? "Update Product" : "Launch Product"} <FiCheckCircle size={14} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;