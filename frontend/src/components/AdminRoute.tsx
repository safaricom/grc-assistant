import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can optionally render a loading spinner here
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    // Redirect them to the home page if they are not an admin.
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
