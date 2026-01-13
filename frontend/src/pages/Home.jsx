import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import CategorySlider from "../components/CategorySlider";
import ProductSkeleton from "../components/ProductSkeleton";
import { FiArrowRight, FiZap, FiStar, FiTrendingUp, FiArrowUpRight } from "react-icons/fi";


const Marquee = ({ text }) => (
  <div className="bg-black text-white py-4 overflow-hidden whitespace-nowrap border-y border-zinc-800">
    <div className="inline-block animate-marquee">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-xs font-black uppercase tracking-[0.4em] mx-8 text-zinc-400">
          {text} <span className="text-white mx-2">•</span>
        </span>
      ))}
    </div>
  </div>
);


const SectionHeader = ({ title, subtitle, link, icon }) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-100 pb-6">
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-black text-white p-1 rounded-full text-[10px]">{icon}</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{subtitle}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-zinc-900 leading-[0.9]">{title}</h2>
    </div>
    {link && (
      <Link to={link} className="hidden md:flex group items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-zinc-100 hover:bg-black hover:text-white px-6 py-3 rounded-full transition-all">
        View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

const Section = ({ title, subtitle, products, tag, icon }) => {
  if (!products || products.length === 0) return null;
  return (
    <div className="mb-32">
      <SectionHeader title={title} subtitle={subtitle} link={`/shop?tag=${tag}`} icon={icon} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};


const Home = () => {
  const [data, setData] = useState({ newArrivals: [], bestSellers: [], trending: [], banners: [] });
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newRes, bestRes, trendRes, bannerRes] = await Promise.all([
          api.get("/products/tag/new-arrival"),
          api.get("/products/tag/best-seller"),
          api.get("/products/tag/trending"),
          api.get("/banners"),
        ]);
        setData({
          newArrivals: newRes.data,
          bestSellers: bestRes.data,
          trending: trendRes.data,
          banners: bannerRes.data
        });
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Carousel Timer
  useEffect(() => {
    if (data.banners.length < 2) return;
    const timer = setInterval(() => setCurrentBanner((prev) => (prev + 1) % data.banners.length), 5000);
    return () => clearInterval(timer);
  }, [data.banners]);

  return (
    <div className="bg-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[90vh] w-full bg-[#050505] text-white overflow-hidden">
        {data.banners.length > 0 ? (
          data.banners.map((banner, index) => (
            <div key={banner._id} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
              <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/30 z-10" />
              <img src={banner.image} className="w-full h-full object-cover opacity-80 animate-slowZoom" alt="Banner" />
              
              <div className="absolute bottom-0 left-0 p-8 md:p-20 z-20 w-full md:w-2/3">
                <span className="inline-block px-3 py-1 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-6 animate-slideUp">
                  Season 01 / 2026
                </span>
                <h1 className="text-6xl md:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter mb-8 animate-slideUp delay-100">
                  {banner.title || "Modern Armor"}
                </h1>
                <Link to={banner.link || "/shop"} className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all animate-slideUp delay-200">
                  Shop Now <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          /* Fallback Hero */
          <div className="absolute inset-0 flex items-center justify-center">
             <h1 className="text-[15vw] font-black text-zinc-900 uppercase tracking-tighter select-none">AURA</h1>
          </div>
        )}
      </div>

      <Marquee text="Premium Essentials • Crafted in India • Global Shipping • New Season Drop" />

      {/* --- CATEGORY CIRCLES --- */}
      <div className="py-10 bg-zinc-50 border-b border-zinc-100">
        <CategorySlider />
      </div>

      <div className="max-w-350 mx-auto px-6 py-24">
        {loading ? (
          <div className="grid grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="space-y-32">
            
            {/* 1. New Arrivals (Limited to 4 for clean look) */}
            <Section 
              title="Just Landed" 
              subtitle="Fresh Drops" 
              products={data.newArrivals.slice(0, 4)} 
              tag="new-arrival" 
              icon={<FiZap />} 
            />

            {/* --- 2. EDITORIAL SECTION (MEN'S FOCUSED) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] mb-32">
              
              {/* Left: The Linen Edit */}
              <Link to="/shop?tag=linen" className="relative group overflow-hidden rounded-[2rem] cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="Linen Edit" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-8 left-8 p-4">
                   <span className="bg-white text-black px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] mb-3 inline-block">
                     Summer Essentials
                   </span>
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-md">
                     The Linen<br />Edit
                   </h3>
                   <span className="mt-4 inline-block text-white border-b border-white text-xs uppercase tracking-widest pb-1 group-hover:border-transparent transition-all">
                     Shop Breathable
                   </span>
                </div>
              </Link>

              {/* Right: Midnight Series */}
              <Link to="/shop?tag=streetwear" className="relative group overflow-hidden rounded-[2rem] cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1887&auto=format&fit=crop" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="Midnight Series" 
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-8 left-8 p-4">
                   <span className="bg-red-600 text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] mb-3 inline-block animate-pulse">
                     Limited Drop
                   </span>
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                     Midnight<br />Series
                   </h3>
                   <span className="mt-4 inline-block text-white border-b border-white text-xs uppercase tracking-widest pb-1 group-hover:border-transparent transition-all">
                     View Collection
                   </span>
                </div>
              </Link>

            </div>

            {/* 3. Best Sellers (Limited to 4) */}
            <Section 
              title="Cult Classics" 
              subtitle="Most Wanted" 
              products={data.bestSellers.slice(0, 4)} 
              tag="best-seller" 
              icon={<FiStar />} 
            />

            {/* 4. Brand Statement */}
            {/* 4. Brand Philosophy - Editorial Split Layout */}
<div className="my-32 max-w-[1400px] mx-auto px-6">
  <div className="flex flex-col md:flex-row items-center bg-zinc-50 rounded-[3rem] overflow-hidden">
    
 

    {/* 4. Brand Philosophy - Men's Editorial Layout */}
<div className="my-32 max-w-[1400px] mx-auto px-6">
  <div className="flex flex-col md:flex-row items-center bg-zinc-50 rounded-[3rem] overflow-hidden">
    
    {/* Left: Image Side (Men's Fashion) */}
    <div className="w-full md:w-1/2 h-[500px] md:h-[600px] relative group">
      <img 
        src="https://images.unsplash.com/photo-1506634572416-48cdfe530110?q=80&w=1885&auto=format&fit=crop" 
        alt="Men's Fashion Editorial" 
        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
      />
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/5" />
    </div>

    {/* Right: Text Side */}
    <div className="w-full md:w-1/2 p-12 md:p-20 flex flex-col justify-center text-left">
      <div className="flex items-center gap-2 mb-6">
        <span className="h-px w-8 bg-zinc-400"></span>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">The Philosophy</span>
      </div>
      
      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-zinc-900">
        "We don't just sell clothes. We design <span className="text-zinc-400">modern armor.</span>"
      </h2>
      
      <p className="text-zinc-500 text-sm leading-relaxed mb-10 max-w-md">
        Stripping away the noise to focus on the silhouette, the fabric, and the feeling. Essentials for the man who builds his own path.
      </p>

      <div>
        <Link 
          to="/about" 
          className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-zinc-600 hover:border-zinc-600 transition-all"
        >
          Read Our Story <FiArrowRight className="group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>
    </div>

  </div>
</div>

  </div>
</div>

            {/* 5. Trending Now - SHOWING ALL PRODUCTS (No limit) */}
            <Section 
              title="Trending Now" 
              subtitle="Viral Hits" 
              products={data.trending}  // <--- CHANGED: Removed .slice(0,4)
              tag="trending" 
              icon={<FiTrendingUp />} 
            />

          </div>
        )}
      </div>

      <Marquee text="Secure Checkout • 30-Day Returns • 24/7 Support • " />
    </div>
  );
};

export default Home;