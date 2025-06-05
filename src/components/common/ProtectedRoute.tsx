import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowed: boolean;
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowed, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};