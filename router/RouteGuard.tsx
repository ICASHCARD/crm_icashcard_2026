import React from 'react';
import { Navigate } from 'react-router-dom';

interface RouteGuardProps {
  allow: boolean;
  redirectTo: string;
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ allow, redirectTo, children }) => {
  if (!allow) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
};

export default RouteGuard;
