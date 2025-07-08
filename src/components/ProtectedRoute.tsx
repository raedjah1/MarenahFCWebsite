import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/signin'
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state if still checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to sign in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}; 