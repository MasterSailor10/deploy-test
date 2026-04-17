import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import withNavigation from '../navigation/withNavigation';
import axios from 'axios';

class Login extends Component {

  state = {
    email: '',
    password: '',
    error: ''
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = this.state;
      const response = await axios.post('http://localhost:5000/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        this.props.navigate('/admin/dashboard');
      } else {
        this.props.navigate('/dashboard');
      }

    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      this.setState({ error: message });
    }
  }

  render() {
    const { email, password, error } = this.state;
    return (
      <div className="login-page">
        <div className="login-box">
          <h2>Welcome back</h2>
          <p className="sub">Login to your account</p>

          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={this.handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={email}
              onChange={this.handleChange}
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={this.handleChange}
            />
            <button type="submit">Login</button>
          </form>
          <p className="switch">Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    );
  }
}

export default withNavigation(Login);
