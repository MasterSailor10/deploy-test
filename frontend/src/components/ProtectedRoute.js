import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly, userOnly, publicOnly }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // publicOnly pages (login, register)
  // if already logged in redirect away
  if (publicOnly) {
    if (token && user) {
      if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/dashboard" />;
      }
    }
    return children;
  }

  // not logged in at all
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // admin trying to go to user only pages
  if (userOnly && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  // user trying to go to admin pages
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default ProtectedRoute;