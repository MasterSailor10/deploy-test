import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

class Navbar extends Component {

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  render() {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">BookLib</Link>
        </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link onClick={this.logOut} to="/login" className="btn-logout">Logout</Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;