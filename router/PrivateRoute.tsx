import React from 'react';
import MainLayout from '@/views/layouts/MainLayout';
import RouteGuard from '@/router/RouteGuard';
import { useAuth } from '@/store/contexts/AuthContext';
import { ROUTES } from '@/config/constants';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <RouteGuard allow={isAuthenticated} redirectTo={ROUTES.LOGIN}>
      <MainLayout>{children}</MainLayout>
    </RouteGuard>
  );
};

export default PrivateRoute;
