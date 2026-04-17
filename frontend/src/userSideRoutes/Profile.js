import React, { Component } from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';
import './Profile.css';

class Profile extends Component {

  state = {
    name: '',
    email: '',
    role: '',
    joined: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    profileMessage: '',
    profileError: '',
    passwordMessage: '',
    passwordError: '',
    loading: true
  }

  componentDidMount = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.get(
        `http://localhost:5000/profile/${user.id}`,
        { 
            headers: 
            { 
                Authorization: `Bearer ${token}` 
            } 
        }
      );

      this.setState({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        joined: response.data.created_at?.split('T')[0],
        loading: false
      });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.put(`http://localhost:5000/profile/${user.id}`,{ name: this.state.name, email: this.state.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('user', JSON.stringify(response.data.user));
      this.setState({ profileMessage: 'Profile updated successfully!', profileError: '' });
    } catch (err) {
      this.setState({ profileError: err.response?.data?.error || 'Update failed', profileMessage: '' });
    }
  }

  handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = this.state;

    if (newPassword !== confirmNewPassword) {
      return this.setState({ passwordError: 'New passwords do not match', passwordMessage: '' });
    }

    if (newPassword.length < 6) {
      return this.setState({ passwordError: 'Password must be at least 6 characters', passwordMessage: '' });
    }

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      await axios.put(
        `http://localhost:5000/profile/${user.id}/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      this.setState({
        passwordMessage: 'Password updated successfully!',
        passwordError: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      this.setState({ passwordError: err.response?.data?.error || 'Update failed', passwordMessage: '' });
    }
  }

  render() {
    const { name, email, role, joined, currentPassword, newPassword, confirmNewPassword, profileMessage, profileError, passwordMessage, passwordError, loading } = this.state;

    if (loading) return <div><Navbar /><p style={{padding: '40px'}}>Loading...</p></div>;

    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-body">

          <div className="profile-top">
            <div className="profile-avatar">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2>{name}</h2>
              <p className="profile-email">{email}</p>
              <div style={{display: 'flex', gap: '10px', marginTop: '8px'}}>
                <span className="role-tag">{role}</span>
                <span className="joined-tag">Joined: {joined}</span>
              </div>
            </div>
          </div>

          <div className="profile-sections">

            <div className="profile-card">
              <h3>Personal Info</h3>
              {profileError && <p className="error-msg">{profileError}</p>}
              {profileMessage && <p className="success-msg">{profileMessage}</p>}
              <form onSubmit={this.handleProfileUpdate}>
                <label>Full name</label>
                <input type="text" name="name" value={name} onChange={this.handleChange} />
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={this.handleChange} />
                <button type="submit">Save Changes</button>
              </form>
            </div>

            <div className="profile-card">
              <h3>Change Password</h3>
              {passwordError && <p className="error-msg">{passwordError}</p>}
              {passwordMessage && <p className="success-msg">{passwordMessage}</p>}
              <form onSubmit={this.handlePasswordUpdate}>
                <label>Current password</label>
                <input type="password" name="currentPassword" placeholder="••••••••" value={currentPassword} onChange={this.handleChange} />
                <label>New password</label>
                <input type="password" name="newPassword" placeholder="••••••••" value={newPassword} onChange={this.handleChange} />
                <label>Confirm new password</label>
                <input type="password" name="confirmNewPassword" placeholder="••••••••" value={confirmNewPassword} onChange={this.handleChange} />
                <button type="submit">Update Password</button>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Profile;