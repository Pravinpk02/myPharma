import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg, #F0FDF4)'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '4px solid rgba(16, 185, 129, 0.1)',
          borderTopColor: 'var(--accent, #10B981)',
          borderRadius: '50%',
          animation: 'authSpin 0.75s linear infinite'
        }} />
        <style>{`
          @keyframes authSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
