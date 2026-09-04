import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/user.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-eco-400 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Validating security session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their authorized home
    if (user.role === 'Administrator') return <Navigate to="/admin" replace />;
    if (user.role === 'Collection Staff') return <Navigate to="/staff" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return <Outlet />;
};
