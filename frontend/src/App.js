import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './userSideRoutes/Home';
import Login from './userSideRoutes/Login';
import Register from './userSideRoutes/Register';
import BookCatalogue from './userSideRoutes/BookCatalogue';
import BookDetail from './userSideRoutes/BookDetail';
import Dashboard from './userSideRoutes/Dashboard';

import AdminDashboard from './adminSideRoutes/AdminDashboard';
import ManageBooks from './adminSideRoutes/ManageBooks';
import ManageUsers from './adminSideRoutes/ManageUsers';
import BorrowRecords from './adminSideRoutes/BorrowRecords';
import Profile from './userSideRoutes/Profile';

// ─────────────────────────────────────
//  INTERCEPTOR WRAPPER
//  Needs to be inside <Router> to access useNavigate
// ─────────────────────────────────────
function AxiosInterceptor({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-attach token to every request
    const reqInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // If server returns 403 (blocked user or bad token) — log out immediately
    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [navigate]);

  return children;
}

// ─────────────────────────────────────
//  APP
// ─────────────────────────────────────
function App() {
  return (
    <Router>
      <AxiosInterceptor>
        <Routes>

          {/* login and register - if already logged in redirect away */}
          <Route path="/login" element={
            <ProtectedRoute publicOnly={true}>
              <Login />
            </ProtectedRoute>
          } />
          <Route path="/register" element={
            <ProtectedRoute publicOnly={true}>
              <Register />
            </ProtectedRoute>
          } />

          {/* user only pages - admin cannot visit */}
          <Route path="/" element={
            <ProtectedRoute userOnly={true}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/books" element={
            <ProtectedRoute userOnly={true}>
              <BookCatalogue />
            </ProtectedRoute>
          } />
          <Route path="/books/:id" element={
            <ProtectedRoute userOnly={true}>
              <BookDetail />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute userOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute userOnly={true}>
              <Profile />
            </ProtectedRoute>
          } />

          {/* admin only pages - user cannot visit */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute adminOnly={true}>
              <ManageBooks />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <ManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/borrows" element={
            <ProtectedRoute adminOnly={true}>
              <BorrowRecords />
            </ProtectedRoute>
          } />

        </Routes>
      </AxiosInterceptor>
    </Router>
  );
}

export default App;
