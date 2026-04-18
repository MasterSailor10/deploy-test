import React, { Component } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import './BorrowRecords.css';

class BorrowRecords extends Component {

  state = {
    records: [],
    filter: 'all',
    error: '',
    success: ''
  }

  fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      // FIX: was calling /request (borrow requests only) — changed to /borrows (actual borrow/return records)
      const response = await axios.get('https://library-management-system-velocity.onrender.com/borrows', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.setState({ records: response.data });
    } catch (err) {
      console.log(err);
    }
  }

  handleReturn = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/borrows/${id}/return`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.setState({ success: 'Book marked as returned!', error: '' });
      await this.fetchRecords();
    } catch (err) {
      this.setState({ error: 'Error updating record', success: '' });
    }
  }

  componentDidMount = async () => {
    await this.fetchRecords();
  }

  handleFilter = (e) => {
    this.setState({ filter: e.target.value });
  }

  render() {
    const { records, filter, error, success } = this.state;

    const filtered = records.filter(r =>
      filter === 'all' || r.status === filter
    );

    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-body">

          <div className="admin-header">
            <h2>Borrow Records</h2>
            <select value={filter} onChange={this.handleFilter}>
              <option value="all">All Records</option>
              <option value="borrowed">Active Borrows</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Book</th>
                <th>Author</th>
                <th>Borrowed</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>No records found</td>
                </tr>
              ) : (
                filtered.map(record => (
                  <tr key={record.id}>
                    <td>{record.user_name}</td>
                    <td>{record.email}</td>
                    <td>{record.title}</td>
                    <td>{record.author}</td>
                    <td>{record.borrow_date}</td>
                    <td>{record.due_date}</td>
                    <td>{record.return_date || '—'}</td>
                    <td>
                      <span className={`badge ${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {record.status !== 'returned'
                        ? <button className="return-btn" onClick={() => this.handleReturn(record.id)}>Mark Returned</button>
                        : <span className="done-text">Done</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>
    );
  }
}

export default BorrowRecords;
