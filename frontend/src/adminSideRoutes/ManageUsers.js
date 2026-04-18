import React, { Component } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import './ManageUsers.css';

class ManageUsers extends Component {

  state = {
    users: [],
    error: '',
    success: ''
  }

  fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://library-management-system-velocity.onrender.com/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    this.setState({ users: response.data });
  } catch (err) {
    console.log(err);
  }
}

toggleBlock = async (id, currentStatus) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `http://localhost:5000/users/${id}/block`,
      { is_blocked: currentStatus === 0 ? 1 : 0 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    this.setState({ success: currentStatus === 0 ? 'User blocked!' : 'User unblocked!', error: '' });
    await this.fetchUsers();
  } catch (err) {
    this.setState({ error: 'Error updating user', success: '' });
  }
}

  componentDidMount = async () => {
    await this.fetchUsers();
  }

  render() {
    const { users, error, success } = this.state;

    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-body">

          <div className="admin-header">
            <h2>Manage Users</h2>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td>{user.created_at?.split('T')[0]}</td>
                  <td>
                    <span className={`badge ${user.is_blocked === 0 ? 'active' : 'blocked'}`}>
                      {user.is_blocked === 0 ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={user.is_blocked === 0 ? 'block-btn' : 'unblock-btn'}
                      onClick={() => this.toggleBlock(user.id, user.is_blocked)}
                    >
                      {user.is_blocked === 0 ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    );
  }
}

export default ManageUsers;
