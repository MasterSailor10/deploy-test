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
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.setState({ users: response.data });
    } catch (err) {
      console.log(err);
    }
  }

  // FIX: MongoDB is_blocked is boolean true/false, not integer 0/1
  toggleBlock = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/users/${id}/block`,
        { is_blocked: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.setState({
        success: !currentStatus ? 'User blocked!' : 'User unblocked!',
        error: ''
      });
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
                    {/* FIX: boolean check instead of === 0 */}
                    <span className={`badge ${user.is_blocked ? 'blocked' : 'active'}`}>
                      {user.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={user.is_blocked ? 'unblock-btn' : 'block-btn'}
                      onClick={() => this.toggleBlock(user.id, user.is_blocked)}
                    >
                      {user.is_blocked ? 'Unblock' : 'Block'}
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
