import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import withNavigation from '../navigation/withNavigation';
import './Register.css';

class Register extends Component {

  state = {
    name: '',
    email: '',
    date: '',
    password: '',
    confirmPassword: '',
    error: '',
    success: ''
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, date, password, confirmPassword } = this.state;

    const formData = { name, email, date, password, confirmPassword };

    try {
      const response = await axios.post("http://localhost:5000/register", formData);
      if (response.status === 201) {
        this.setState({ success: 'Registered Successfully! Redirecting...', error: '' });
        setTimeout(() => {
          this.props.navigate("/login");
        }, 500);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      this.setState({ error: message, success: '' });
    }
  }

  render() {
    const { name, email, password, date, confirmPassword, error, success } = this.state;

    return (
      <div className="register-page">
        <div className="register-box">
          <h2>Create account</h2>
          <p className="sub">Join BookLib today</p>
          <form onSubmit={this.handleSubmit}>
            <label>Full name</label>
            <input
              type="text"
              name="name"
              placeholder="John Smith"
              value={name}
              onChange={this.handleChange}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              value={email}
              onChange={this.handleChange}
            />
            <label>Date of Birth</label>
            <input
              type='date'
              name="date"
              placeholder=""
              value={date}
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
            <label>Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={this.handleChange}
            />
            <button type="submit">Register</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <p className="switch">Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    );
  }
}

export default withNavigation(Register);