import { useState, useEffect } from "react";
import api from "../services/api";
import { FiPlus, FiTrash2, FiImage, FiLink, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState("");
  const [link, setLink] = useState("/shop");

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/banners/admin");
      setBanners(data);
    } catch (err) { toast.error("Failed to load banners"); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/banners", { image, link });
      toast.success("Banner published");
      setImage(""); fetchBanners();
    } catch (err) { toast.error("Upload failed"); }
  };

  const toggleStatus = async (id) => {
    try {
      await api.put(`/banners/${id}/toggle`);
      fetchBanners();
    } catch (err) { toast.error("Update failed"); }
  };

  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success("Banner removed");
      fetchBanners();
    } catch (err) { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-6">Storefront Banner Management</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" placeholder="Image URL" 
            className="flex-1 bg-zinc-50 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-black"
            value={image} onChange={(e) => setImage(e.target.value)} required
          />
          <input 
            type="text" placeholder="Link (e.g., /shop)" 
            className="flex-1 bg-zinc-50 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-black"
            value={link} onChange={(e) => setLink(e.target.value)}
          />
          <button type="submit" className="bg-black text-white px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest">
            Add Banner
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div key={b._id} className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-zinc-100 bg-white group">
            <img src={b.image} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${b.isActive ? 'bg-emerald-500 text-white' : 'bg-zinc-400 text-white'}`}>
                {b.isActive ? "Active" : "Hidden"}
              </span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => toggleStatus(b._id)} className="p-2 bg-white rounded-lg shadow-lg">
                {b.isActive ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
              </button>
              <button onClick={() => deleteBanner(b._id)} className="p-2 bg-white text-red-500 rounded-lg shadow-lg">
                <FiTrash2 size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;