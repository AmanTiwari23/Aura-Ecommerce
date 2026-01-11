import { Link } from "react-router-dom";
import { 
  FiInstagram, 
  FiFacebook, 
  FiTwitter, 
  FiYoutube, 
  FiArrowRight, 
  FiMail, 
  FiMapPin 
} from "react-icons/fi";
import toast from "react-hot-toast";

const Footer = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
    toast.success("Welcome to the Aura Inner Circle!", {
      icon: '✉️',
      style: {
        borderRadius: '0px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <footer className="bg-[#0a0a0a] text-white mt-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black tracking-[0.2em] mb-6">AURA</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Defining modern Indian menswear. We craft premium essentials for the contemporary man who values style and substance.
            </p>
            <form onSubmit={handleNewsletter} className="relative group">
              <input 
                type="email" 
                placeholder="Join the newsletter" 
                className="w-full bg-transparent border-b border-zinc-700 py-2 pr-10 text-sm focus:border-white outline-none transition-colors"
                required
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-white transition-colors">
                <FiArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-zinc-300">Collections</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link to="/category/casual" className="hover:text-white hover:pl-2 transition-all duration-300">New Arrivals</Link></li>
              <li><Link to="/category/streetwear" className="hover:text-white hover:pl-2 transition-all duration-300">Streetwear Essentials</Link></li>
              <li><Link to="/category/formal" className="hover:text-white hover:pl-2 transition-all duration-300">The Formal Edit</Link></li>
              <li><Link to="/category/ethnic" className="hover:text-white hover:pl-2 transition-all duration-300">Modern Ethnic</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-zinc-300">Assistance</h3>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link to="/orders" className="hover:text-white transition-colors">Track My Order</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-zinc-300">Connect</h3>
            <div className="space-y-4 text-sm text-zinc-500">
              <p className="flex items-center gap-3">
                <FiMapPin className="text-white" /> Mumbai, Maharashtra, India
              </p>
              <p className="flex items-center gap-3">
                <FiMail className="text-white" /> support@auraclo.com
              </p>
              <div className="flex gap-5 pt-4">
                <a href="#" className="text-zinc-500 hover:text-white transition-colors"><FiInstagram size={20} /></a>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors"><FiFacebook size={20} /></a>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors"><FiTwitter size={20} /></a>
                <a href="#" className="text-zinc-500 hover:text-white transition-colors"><FiYoutube size={20} /></a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600">
            © {new Date().getFullYear()} Aura Clothing Co. Crafted for Excellence.
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest text-zinc-600">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/refund" className="hover:text-white transition-colors">Refunds</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;