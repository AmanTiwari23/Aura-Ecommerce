import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import CategorySlider from "../components/CategorySlider";
import ProductSkeleton from "../components/ProductSkeleton";
import { FiArrowRight, FiZap, FiStar, FiTrendingUp } from "react-icons/fi";

const Section = ({ title, products, tag, icon }) => {
  if (!products.length) return null;

  return (
    <div className="mb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-400">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Featured Collection</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900">{title}</h2>
        </div>

        <Link 
          to={`/shop?tag=${tag}`} 
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b-2 border-transparent hover:border-black pb-1 transition-all"
        >
          View Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
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
  const [banners, setBanners] = useState([]); // New: Banners State
  const [currentBanner, setCurrentBanner] = useState(0); // New: Carousel Index
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [newRes, bestRes, trendRes, bannerRes] = await Promise.all([
          api.get("/products/tag/new-arrival"),
          api.get("/products/tag/best-seller"),
          api.get("/products/tag/trending"),
          api.get("/banners"), // New: Fetch active banners
        ]);
        setNewArrivals(newRes.data);
        setBestSellers(bestRes.data);
        setTrending(trendRes.data);
        setBanners(bannerRes.data);
      } catch (err) {
        console.error("Home data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // New: Carousel Timer Logic
  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  return (
    <div className="bg-white overflow-hidden">
      
      {/* --- DYNAMIC CINEMATIC HERO --- */}
      <div className="relative h-[85vh] w-full bg-[#0a0a0a] overflow-hidden">
        {banners.length > 0 ? (
          // 1. Dynamic Banner Slider
          banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
                index === currentBanner ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Image with subtle zoom effect */}
              <img 
                src={banner.image} 
                className={`w-full h-full object-cover opacity-60 transition-transform duration-[10000ms] ${index === currentBanner ? "scale-110" : "scale-100"}`} 
                alt="Promotion" 
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 mb-4 animate-fadeIn">
                  Aura Seasonal Campaign
                </span>
                <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-10">
                  New <span className="text-zinc-600">Era.</span>
                </h1>
                <Link 
                  to={banner.link || "/shop"} 
                  className="bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all shadow-2xl"
                >
                  Shop the Look
                </Link>
              </div>
            </div>
          ))
        ) : (
          // 2. Original Fallback Hero (Your original design)
          <>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-700/10 blur-[120px] rounded-full" />
            </div>
            <div className="relative z-10 text-center px-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-4 block animate-fadeIn">
                Established 2024
              </span>
              <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                Aura<span className="text-zinc-700">.</span>
              </h1>
              <p className="text-zinc-400 text-sm md:text-base tracking-[0.2em] uppercase font-light mb-10 max-w-lg mx-auto">
                Redefining the modern silhouette with premium Indian craftsmanship.
              </p>
              <Link to="/shop" className="bg-white text-black px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all">
                Explore Collection
              </Link>
            </div>
          </>
        )}

        {/* Carousel Indicators (Dots) */}
        {banners.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`h-[2px] transition-all duration-500 ${i === currentBanner ? "w-12 bg-white" : "w-4 bg-white/20"}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* --- END HERO --- */}

      <CategorySlider />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            <Section
              title="New Arrivals"
              products={newArrivals}
              tag="new-arrival"
              icon={<FiZap size={14} />}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-24">
              <div className="h-100 bg-zinc-100 flex flex-col items-center justify-center p-12 text-center group cursor-pointer overflow-hidden relative">
                <div className="z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">The Linen Edit</h3>
                  <p className="text-sm text-zinc-500 mb-6 uppercase tracking-widest">Breathable essentials for the summer.</p>
                  <span className="text-[10px] font-bold uppercase border-b-2 border-black pb-1">Shop Fabric</span>
                </div>
              </div>
              <div className="h-100 bg-black text-white flex flex-col items-center justify-center p-12 text-center group cursor-pointer">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Midnight Streetwear</h3>
                <p className="text-zinc-500 text-sm mb-6 uppercase tracking-widest">Limited edition drops at 12:00 AM.</p>
                <span className="text-[10px] font-bold uppercase border-b-2 border-white pb-1">View Drop</span>
              </div>
            </div>

            <Section
              title="Best Sellers"
              products={bestSellers}
              tag="best-seller"
              icon={<FiStar size={14} />}
            />
            
            <Section 
              title="Trending Now" 
              products={trending} 
              tag="trending" 
              icon={<FiTrendingUp size={14} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;