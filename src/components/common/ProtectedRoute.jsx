import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Protected Route component for LPK Humaira quiz system
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {'siswa' | 'sensei'} props.requiredRole - The role required to access the route
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-[#B91C1C] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#B91C1C] font-medium font-poppins">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={`/quiz/login-${requiredRole}`} replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={`/quiz/dashboard-${role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
