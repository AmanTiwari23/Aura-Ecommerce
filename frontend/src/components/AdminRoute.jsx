import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  // Destructure loading to prevent accidental redirects during initial boot
  const { user, loading } = useSelector((state) => state.auth);

  // 1. Show a clean loader while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-10 h-10 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Verifying Permissions
        </p>
      </div>
    );
  }

  // 2. Check for Admin Privileges
  if (!user || user.role !== "admin") {
    // Notify the user they don't have access
    toast.error("Access Restricted: Administrator privileges required.", {
      id: "admin-denied", // Prevents multiple toasts on re-renders
      style: {
        borderRadius: '0px',
        background: '#000',
        color: '#fff',
        fontSize: '11px',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }
    });
    
    return <Navigate to="/" replace />;
  }

  // 3. Render children (or Outlet for nested routes)
  return children ? children : <Outlet />;
};

export default AdminRoute;