import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import CategorySlider from "../components/CategorySlider";
import ProductSkeleton from "../components/ProductSkeleton";

const Section = ({ title, products, tag }) => {
  if (!products.length) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>

        <a href={`/shop?tag=${tag}`} className="text-sm underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchHomeData = async () => {
      const [newRes, bestRes, trendRes] = await Promise.all([
        api.get("/products/tag/new-arrival"),
        api.get("/products/tag/best-seller"),
        api.get("/products/tag/trending"),
      ]);

      setNewArrivals(newRes.data);
      setBestSellers(bestRes.data);
      setTrending(trendRes.data);
      setLoading(false);

    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* HERO */}
      <div className="bg-black text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Aura</h1>
        <p className="text-lg mb-6">Elevate Your Everyday Style</p>
        <a href="/shop" className="bg-white text-black px-6 py-3 font-semibold">
          Shop Now
        </a>
      </div>

      <CategorySlider />

      {/* SECTIONS */}
      {loading ? (
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="p-6 max-w-7xl mx-auto">
          <Section
            title="New Arrivals"
            products={newArrivals}
            tag="new-arrival"
          />
          <Section
            title="Best Sellers"
            products={bestSellers}
            tag="best-seller"
          />
          <Section title="Trending Now" products={trending} tag="trending" />
        </div>
      )}
    </div>
  );
};

export default Home;
