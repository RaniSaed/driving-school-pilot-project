import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode | ((user: any) => React.ReactElement);
  allowedRoles?: UserRole[];
}

const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If children is a function, call it with the user
  if (typeof children === 'function') {
    return children(user);
  }

  // Otherwise, render children as React nodes
  return <>{children}</>;
};

export default RouteGuard;
