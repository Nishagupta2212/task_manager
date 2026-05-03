import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'member';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userData && userData.role === 'member' && !userData.isApproved) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userData && userData.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
