import React from 'react';
import { UserState } from '../Components/Context/UserContext';
import { Navigate } from 'react-router-dom';
import Loader from '../Components/Utiles/Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = UserState();
  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;