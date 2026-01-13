import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  
  const { user, loading } = useSelector((state) => state.auth);

 
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

  
  if (!user || user.role !== "admin") {
    
    toast.error("Access Restricted: Administrator privileges required.", {
      id: "admin-denied", 
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

  
  return children ? children : <Outlet />;
};

export default AdminRoute;