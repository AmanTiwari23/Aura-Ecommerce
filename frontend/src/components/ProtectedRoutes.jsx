import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-10 h-10 border-4 border-zinc-100 border-t-black rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Securing Session
        </p>
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;