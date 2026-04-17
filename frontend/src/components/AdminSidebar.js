import React from 'react';
import { Link } from 'react-router-dom';
import './AdminSidebar.css';

const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

function AdminSidebar() {
  return (
    <div className="sidebar">
      <p className="sidebar-logo">BookLib Admin</p>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/books">Manage Books</Link>
      <Link to="/admin/users">Manage Users</Link>
      <Link to="/admin/borrows">Borrow Records</Link>
      <Link onClick={logOut} to="/login" className="logout-link">Logout</Link>
    </div>
  );
}

export default AdminSidebar;