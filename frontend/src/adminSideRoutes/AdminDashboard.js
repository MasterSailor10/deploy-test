import React, { Component } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import './AdminDashboard.css';

class AdminDashboard extends Component {

  state = {
    stats: null,
    loading: true
  }

  componentDidMount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://library-management-system-velocity.onrender.com/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.setState({ stats: response.data, loading: false });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }

  render() {
    const { stats, loading } = this.state;

    if (loading) return <div style={{padding: '40px'}}>Loading...</div>;

    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-body">
          <h2>Overview</h2>

          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-label">Total books</p>
              <p className="stat-num">{stats.totalBooks}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total users</p>
              <p className="stat-num">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Active borrows</p>
              <p className="stat-num">{stats.activeBorrows}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Overdue</p>
              <p className="stat-num red">{stats.overdueBorrows}</p>
            </div>
          </div>

          <h3>Recent activity</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBorrows.map(record => (
                <tr key={record.id}>
                  <td>{record.user_name}</td>
                  <td>{record.title}</td>
                  <td>{record.borrow_date}</td>
                  <td>{record.due_date}</td>
                  <td>
                    <span className={`badge ${record.status}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
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

export default AdminDashboard;
