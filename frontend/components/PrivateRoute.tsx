import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedFor?: 'student' | 'company' | 'both';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedFor = 'both' }) => {
  const student = sessionStorage.getItem('studentUser');
  const company = sessionStorage.getItem('companyUser');

  if (allowedFor === 'student' && !student) return <Navigate to="/student-auth" replace />;
  if (allowedFor === 'company' && !company) return <Navigate to="/company-auth" replace />;
  if (allowedFor === 'both' && !student && !company) return <Navigate to="/student-auth" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
