import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  return (
    <div className="overflow-x-auto flex gap-4 py-4 px-6 bg-white">
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => navigate(`/shop?category=${cat._id}`)}
          className="min-w-max px-6 py-2 border rounded-full hover:bg-black hover:text-white transition"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategorySlider;
