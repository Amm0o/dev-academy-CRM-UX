// filepath: /home/anoliveira/repos/crm-frontend/src/components/Routes/AdminRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services';
import './AdminRoute.css'

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, loading: authLoading, verifyRole } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState(false);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!isAuthenticated || !user) {
        setVerifying(false);
        return;
      }

      // Double-check admin role with backend
      const token = localStorage.getItem('authToken');
      if (token && user.role === 'Admin') {
        try {
          const response = await authService.verifyAdminStatus(token);
          setIsVerifiedAdmin(response.data || false);
        } catch (error) {
          console.error('Failed to verify admin status:', error);
          setIsVerifiedAdmin(false);
        }
      } else {
        setIsVerifiedAdmin(false);
      }
      
      setVerifying(false);
    };

    verifyAdminAccess();
  }, [isAuthenticated, user, verifyRole]);

  if (authLoading || verifying) {
    return (
      <div className="admin-verification">
        <div className="loading-spinner">Verifying access...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerifiedAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;