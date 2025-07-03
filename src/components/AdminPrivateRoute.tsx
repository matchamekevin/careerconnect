import React from 'react';
import { Navigate } from 'react-router-dom';

interface AdminPrivateRouteProps {
  children: React.ReactNode;
}

const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ children }) => {
  const admin = sessionStorage.getItem('adminUser');
  if (!admin) return <Navigate to="/admin-auth" replace />;
  return <>{children}</>;
};

export default AdminPrivateRoute;
