import React, { Component } from 'react';
import Navbar from '../components/NavBar';
import axios from 'axios';
import './Dashboard.css';

class Dashboard extends Component {

  state = {
    borrows: [],
    loading: true
  }

  componentDidMount = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.get(
        `https://library-management-system-velocity.onrender.com/borrows/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      this.setState({ borrows: response.data, loading: false });
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }

  render() {
    const { borrows, loading } = this.state;
    const user = JSON.parse(localStorage.getItem('user'));

    const currentBorrows = borrows.filter(b => b.status === 'borrowed' || b.status === 'overdue');
    const history = borrows.filter(b => b.status === 'returned');

    if (loading) return <div><Navbar /><p style={{padding: '40px'}}>Loading...</p></div>;

    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-body">
          <h2>Hello, {user.name}!</h2>
          <p className="sub-text">Here is your library activity</p>

          <div className="stats-row">
            <div className="stat-card">
              <p className="stat-label">Currently borrowed</p>
              <p className="stat-number">{currentBorrows.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total borrowed</p>
              <p className="stat-number">{borrows.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Overdue</p>
              <p className="stat-number red">{borrows.filter(b => b.status === 'overdue').length}</p>
            </div>
          </div>

          <h3>Currently borrowed</h3>
          {currentBorrows.length === 0
            ? <p className="empty-text">No books currently borrowed</p>
            : currentBorrows.map(book => (
              <div className={`borrow-card ${book.status === 'overdue' ? 'overdue' : ''}`} key={book.id}>
                <div className="borrow-cover">
                  <img src={book.cover_url} alt={book.title} />
                </div>
                <div className="borrow-info">
                  <p className="b-title">{book.title}</p>
                  <p className="b-author">{book.author}</p>
                  <p className="b-dates">Borrowed: {book.borrow_date} &nbsp;|&nbsp; Due: {book.due_date}</p>
                </div>
                <span className={`status-badge ${book.status === 'overdue' ? 'over' : 'ok'}`}>
                  {book.status === 'overdue' ? 'Overdue' : 'On time'}
                </span>
              </div>
            ))
          }

          <h3 style={{marginTop: '32px'}}>Borrow history</h3>
          {history.length === 0
            ? <p className="empty-text">No borrow history yet</p>
            : (
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Borrowed</th>
                    <th>Returned</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(record => (
                    <tr key={record.id}>
                      <td>{record.title}</td>
                      <td>{record.author}</td>
                      <td>{record.borrow_date}</td>
                      <td>{record.return_date}</td>
                      <td><span className="badge returned">Returned</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    );
  }
}

export default Dashboard;
