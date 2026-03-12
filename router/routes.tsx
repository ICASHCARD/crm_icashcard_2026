import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { useAuth } from '@/store/contexts/AuthContext';
import PrivateRoute from '@/router/PrivateRoute';
import AuthLayout from '@/views/layouts/AuthLayout';
import DashboardPage from '@/views/pages/DashboardPage';
import LoginPage from '@/views/pages/LoginPage';
import SalesPage from '@/views/pages/SalesPage';
import ContactsPage from '@/views/pages/ContactsPage';
import PackagesPage from '@/views/pages/PackagesPage';
import ProfilePage from '@/views/pages/ProfilePage';
import FinancePage from '@/views/pages/FinancePage';
import InvoicesPage from '@/views/pages/InvoicesPage';
import CompaniesPage from '@/views/pages/CompaniesPage';
import UsersPage from '@/views/pages/UsersPage';
import NavigationPage from '@/views/pages/NavigationPage';
import IdentityPage from '@/views/pages/IdentityPage';
import ProposalsTrackingPage from '@/views/pages/ProposalsTrackingPage';
import SimulateProposalPage from '@/views/pages/SimulateProposalPage';
import CommissionTablesPage from '@/views/pages/CommissionTablesPage';
import AcquirersPage from '@/views/pages/AcquirersPage';
import CommissionGroupsPage from '@/views/pages/CommissionGroupsPage';
import SalesReportPage from '@/views/pages/SalesReportPage';
import ReceiptsPage from '@/views/pages/ReceiptsPage';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;

  if (isAuthenticated) return <Navigate to={ROUTES.HOME} replace />;
  return <AuthLayout>{children}</AuthLayout>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/proposals/simulate" element={<PrivateRoute><SimulateProposalPage /></PrivateRoute>} />
      <Route path="/proposals/tracking" element={<PrivateRoute><ProposalsTrackingPage /></PrivateRoute>} />
      <Route path="/billing/sales-report" element={<PrivateRoute><SalesReportPage /></PrivateRoute>} />
      <Route path="/billing/receipts" element={<PrivateRoute><ReceiptsPage /></PrivateRoute>} />
      <Route path="/commercial/tables" element={<PrivateRoute><CommissionTablesPage /></PrivateRoute>} />
      <Route path="/commercial/fintechs" element={<PrivateRoute><AcquirersPage /></PrivateRoute>} />
      <Route path="/commercial/groups" element={<PrivateRoute><CommissionGroupsPage /></PrivateRoute>} />
      <Route path="/commercial/links" element={<PrivateRoute><CommissionTablesPage /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ContactsPage /></PrivateRoute>} />
      <Route path="/users" element={<PrivateRoute><UsersPage /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><PackagesPage /></PrivateRoute>} />
      <Route path="/sales" element={<PrivateRoute><SalesPage /></PrivateRoute>} />
      <Route path="/finance" element={<PrivateRoute><FinancePage /></PrivateRoute>} />
      <Route path="/invoices" element={<PrivateRoute><InvoicesPage /></PrivateRoute>} />
      <Route path="/companies" element={<PrivateRoute><CompaniesPage /></PrivateRoute>} />
      <Route path="/profiles" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/navigation" element={<PrivateRoute><NavigationPage /></PrivateRoute>} />
      <Route path="/identity" element={<PrivateRoute><IdentityPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
