import { useEffect, useState } from "react";
import api from "../services/api";

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
    sizes: "",
    images: [],
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        categories: product.categories.map((c) => c._id),
        tags: product.tags.join(","),
        colors: product.colors.join(","),
        sizes: JSON.stringify(product.sizes),
      });
    }
  }, [product]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    data.append("price", form.price);
    data.append("discountPrice", form.discountPrice);
    data.append("description", form.description);
    data.append("categories", JSON.stringify(form.categories));
    data.append(
      "tags",
      JSON.stringify(form.tags.split(",").map((t) => t.trim()))
    );
    data.append(
      "colors",
      JSON.stringify(form.colors.split(",").map((c) => c.trim()))
    );
    data.append("sizes", form.sizes);

    for (let file of form.images) {
      data.append("images", file);
    }

    if (product) {
      await api.put(`/products/${product._id}`, data);
    } else {
      await api.post("/products", data);
    }

    onSuccess();
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <input name="name" placeholder="Product Name" value={form.name} onChange={changeHandler} className="w-full border p-2" />
      <input name="price" placeholder="Price" value={form.price} onChange={changeHandler} className="w-full border p-2" />
      <input name="discountPrice" placeholder="Discount Price" value={form.discountPrice} onChange={changeHandler} className="w-full border p-2" />

      <textarea name="description" placeholder="Description" value={form.description} onChange={changeHandler} className="w-full border p-2" />

      <select
        multiple
        className="w-full border p-2"
        onChange={(e) =>
          setForm({
            ...form,
            categories: Array.from(e.target.selectedOptions, (o) => o.value),
          })
        }
      >
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <input name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={changeHandler} className="w-full border p-2" />
      <input name="colors" placeholder="Colors (comma separated)" value={form.colors} onChange={changeHandler} className="w-full border p-2" />

      <textarea name="sizes" placeholder='Sizes JSON [{"size":"M","stock":10}]' value={form.sizes} onChange={changeHandler} className="w-full border p-2" />

      <input
        type="file"
        multiple
        onChange={(e) =>
          setForm({ ...form, images: e.target.files })
        }
      />

      <button className="bg-black text-white px-6 py-2">
        {product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};

export default ProductForm;
