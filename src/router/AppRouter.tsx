import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PageLoader } from '../components/PageLoader';
import { useAuth } from '../context/AuthContext';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('../features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('../features/auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../features/auth/ResetPasswordPage'));
const MainLayout = lazy(() => import('../layouts/MainLayout'));
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const Orders = lazy(() => import('../features/orders/Orders'));
const Inventory = lazy(() => import('../features/inventory/Inventory'));
const NewProductPage = lazy(() => import('../features/inventory/NewProductPage'));
const BulkOrderUpdatePage = lazy(() => import('../features/inventory/BulkOrderUpdatePage'));
const CustomersPage = lazy(() => import('../features/customers/CustomerComp'));
const ReportsPage = lazy(() => import('../features/reports/Reports'));
const NewReportPage = lazy(() => import('../features/reports/NewReportPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));
const AnalyticsPage = lazy(() => import('../features/analytics/Analytics'));

const PageFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--bg, #F1F5F3)',
    fontFamily: 'system-ui, sans-serif',
    color: 'var(--accent, #1D9E75)',
    flexDirection: 'column',
    gap: '12px'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid rgba(29, 158, 117, 0.15)',
      borderTopColor: 'var(--accent, #1D9E75)',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    <span style={{ fontSize: '13px', fontWeight: 600 }}>Loading Portal...</span>
  </div>
);

export const AppRouter = () => {
  const { token, loading } = useAuth();
  return (
    <BrowserRouter>
      {loading ? (
        <PageFallback />
      ) : (
        <>
          <PageLoader />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/create-account" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Private administrative routes (guarded) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/new" element={<NewProductPage />} />
                  <Route path="/inventory/bulk-update" element={<BulkOrderUpdatePage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/reports/new" element={<NewReportPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Route>
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
              <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
            </Routes>
          </Suspense>
        </>
      )}
    </BrowserRouter>
  );
};
