import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to admin login page
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;