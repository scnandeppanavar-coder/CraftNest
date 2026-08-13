import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, customerOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // User is not logged in
  if (!isAuthenticated) {
    if (adminOnly) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (customerOnly) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }

  if (customerOnly && user?.role !== 'CUSTOMER') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;