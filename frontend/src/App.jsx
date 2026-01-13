import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import { loadUser } from "./redux/authSlice";

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./admin/AdminLayout";

// User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";
import OrderSuccess from "./pages/OrderSuccess";
import Checkout from "./pages/Checkout";

// Admin Pages
import Dashboard from "./admin/Dashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/Products";
import AdminUsers from "./admin/Users";
import AdminBanners from "./admin/AdminBanners"; // NEW: Added Banner Management Import
import About from "./pages/About";
import AdminCategories from "./admin/AdminCategories";

/**
 * Utility: ScrollToTop
 * Ensures the user starts at the top of the page on every route change.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  /**
   * Global Splash Screen
   * Prevents layout shifts and accidental redirects during initial auth check.
   */
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <h1 className="text-2xl font-black uppercase tracking-[0.5em] animate-pulse text-zinc-900">
          Aura
        </h1>
        <div className="mt-6 w-16 h-[1.5px] bg-zinc-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-black animate-loading-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Logic Utilities */}
      <ScrollToTop />
      
      {/* Global Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#000',
            color: '#fff',
            borderRadius: '0px',
            fontSize: '11px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: '700'
          },
          success: {
            iconTheme: { primary: '#fff', secondary: '#000' }
          }
        }}
      />

      <div className="flex flex-col min-h-screen font-sans selection:bg-zinc-900 selection:text-white">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />

            {/* --- User Protected Routes --- */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* --- Admin Protected Routes (Nested) --- */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              {/* index is equivalent to path="/admin" */}
              <Route index element={<Dashboard />} /> 
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="users" element={<AdminUsers />} />
              {/* NEW: Added Banner Route */}
              <Route path="banners" element={<AdminBanners />} /> 
              <Route path="categories" element={<AdminCategories />} />
            </Route>

            {/* --- 404 Handling --- */}
            <Route path="*" element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-center px-6 relative overflow-hidden">
                <span className="text-[120px] font-black leading-none text-zinc-100 absolute -z-10 select-none">404</span>
                <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900">Page Not Found</h2>
                <p className="text-zinc-500 text-xs mt-2 uppercase tracking-[0.2em]">The collection you're looking for doesn't exist.</p>
                <a href="/" className="mt-8 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all">
                  Return Home
                </a>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;