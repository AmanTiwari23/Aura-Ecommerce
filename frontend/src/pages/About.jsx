import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiScissors, FiGlobe, FiTarget, FiArrowRight } from "react-icons/fi";

/* --- REUSABLE COMPONENTS --- */
const Marquee = ({ text }) => (
  <div className="bg-zinc-900 text-zinc-500 py-3 overflow-hidden whitespace-nowrap border-y border-zinc-800">
    <div className="inline-block animate-marquee">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-[10px] font-black uppercase tracking-[0.4em] mx-8">
          {text} <span className="text-zinc-700 mx-2">•</span>
        </span>
      ))}
    </div>
  </div>
);

const Stat = ({ number, label }) => (
  <div className="text-center">
    <h3 className="text-5xl md:text-7xl font-black text-black tracking-tighter mb-2">{number}</h3>
    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{label}</p>
  </div>
);

/* --- MAIN PAGE --- */
const About = () => {
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      
      {/* 1. CINEMATIC HERO */}
      <div className="relative h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=2574&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale"
            alt="Texture" 
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <span className="inline-block text-white/70 border border-white/20 rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
            Established 2024 • India
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85]">
            The Aura<br /><span className="text-zinc-500">Standard.</span>
          </h1>
        </div>
      </div>

      <Marquee text="Defining the Modern Silhouette • Quality Over Quantity •" />

      {/* 2. THE ORIGIN STORY */}
      <div className="max-w-[1400px] mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              Not just a Brand.<br />A Movement.
            </h2>
            <div className="space-y-6 text-zinc-600 text-sm md:text-base leading-relaxed max-w-lg">
              <p>
                <strong className="text-black">Aura</strong> was born from a simple frustration: the gap between high-street fast fashion and inaccessible luxury. We wanted to build something that stood in the middle—accessible, yet uncompromising.
              </p>
              <p>
                Based in the heart of India, we fuse traditional craftsmanship with brutalist, modern aesthetics. We don't chase trends. We design uniforms for the creatives, the builders, and the disruptors of the modern era.
              </p>
              <p>
                Every stitch tells a story of precision. Every fabric is chosen for its character. This isn't just clothing; it's modern armor.
              </p>
            </div>
            <img 
              src="https://fontmeme.com/permalink/250111/Signature.png" 
              alt="Signature" 
              className="h-12 opacity-50 mt-8" // You can replace this with a real signature image
            />
          </div>
          
          <div className="relative">
            <div className="aspect-[3/4] bg-zinc-100 rounded-[2rem] overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1887&auto=format&fit=crop" 
                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                 alt="The Atelier" 
               />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-black text-white p-8 rounded-tr-3xl">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Designed In</p>
               <p className="text-2xl font-bold uppercase">Bhopal, MP</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE PILLARS */}
      <div className="bg-zinc-50 py-24 border-y border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="group p-8 bg-white border border-zinc-100 hover:border-black transition-colors duration-500">
              <FiScissors className="text-4xl mb-6 text-zinc-400 group-hover:text-black transition-colors" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">The Cut</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-wide leading-loose">
                Oversized, boxy, yet tailored. We spent 6 months perfecting our signature tee fit to ensure it drapes perfectly on every body type.
              </p>
            </div>

            <div className="group p-8 bg-white border border-zinc-100 hover:border-black transition-colors duration-500">
              <FiGlobe className="text-4xl mb-6 text-zinc-400 group-hover:text-black transition-colors" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">The Fabric</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-wide leading-loose">
                Sourced locally from sustainable Indian mills. Heavyweight 240 GSM cotton and breathable premium linens that get better with age.
              </p>
            </div>

            <div className="group p-8 bg-white border border-zinc-100 hover:border-black transition-colors duration-500">
              <FiTarget className="text-4xl mb-6 text-zinc-400 group-hover:text-black transition-colors" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">The Vision</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-wide leading-loose">
                To put Indian streetwear on the global map. We operate on a 'Drop' model—limited quantities to ensure exclusivity and zero waste.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 4. STATS BREAK */}
      <div className="py-24">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <Stat number="01" label="Flagship Store" />
          <Stat number="24" label="Collections" />
          <Stat number="5k+" label="Community" />
          <Stat number="100%" label="Made in India" />
        </div>
      </div>

      {/* 5. VISUAL GALLERY (GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-4 h-[400px] md:h-[600px]">
        <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1780&auto=format&fit=crop" className="w-full h-full object-cover" alt="Fabric" />
        <img src="https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Sketch" />
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover" alt="Sewing" />
        <div className="bg-black flex flex-col items-center justify-center text-center p-8">
           <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-4">Join the<br />Cult.</h3>
           <Link to="/shop" className="bg-white text-black px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center gap-2">
             Shop Now <FiArrowRight />
           </Link>
        </div>
      </div>

    </div>
  );
};

export default About;