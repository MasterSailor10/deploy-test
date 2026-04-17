import React, { Component } from 'react';
import Navbar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class BookDetail extends Component {

  state = {
    book: null,
    loading: true,
    alreadyBorrowed: false,
    borrowed: false,
    message: '',
    error: '',
  }

  componentDidMount = async () => {
    const { id } = this.props.params;
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const bookResponse = await axios.get(
        `http://localhost:5000/books/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const borrowResponse = await axios.get(
        `http://localhost:5000/borrows/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const alreadyBorrowed = borrowResponse.data.some(
        b => b.book_id === parseInt(id) && b.status === 'borrowed'
      );

      this.setState({
        book: bookResponse.data,
        alreadyBorrowed,
        loading: false
      });

    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
    }
  }

  handleBorrow = async () => {
    const { book } = this.state;
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      await axios.post(
        'http://localhost:5000/borrows',
        { user_id: user.id, book_id: book.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update available_copies locally so badge updates without refetch
      this.setState(prev => ({
        borrowed: true,
        alreadyBorrowed: true,
        message: 'Book borrowed successfully!',
        error: '',
        book: {
          ...prev.book,
          available_copies: prev.book.available_copies - 1
        }
      }));

    } catch (err) {
      this.setState({
        error: err.response?.data?.error || 'Something went wrong',
        message: ''
      });
    }
  }

  render() {
    const { book, loading, alreadyBorrowed, message, error } = this.state;

    if (loading) {
      return (
        <div>
          <Navbar />
          <div className="not-found"><h2>Loading...</h2></div>
        </div>
      );
    }

    if (!book) {
      return (
        <div>
          <Navbar />
          <div className="not-found"><h2>Book not found</h2></div>
        </div>
      );
    }

    return (
      <div className="detail-page">
        <Navbar />

        <div className="detail-hero">

          <div className="detail-cover-wrap">
            <div className="detail-cover">
              <img className="book-url" alt={book.title} src={book.book_url} />
            </div>

            <span className={`avail-badge ${book.available_copies > 0 ? 'available' : 'unavailable'}`}>
              {book.available_copies > 0 ? 'Available to Borrow' : 'Currently Unavailable'}
            </span>

            {message && <p className="borrow-success">{message}</p>}
            {error && <p className="borrow-error">{error}</p>}

            {alreadyBorrowed ? (
              <button className="borrow-btn borrowed-btn" disabled>
                Already Borrowed
              </button>
            ) : book.available_copies > 0 ? (
              <button className="borrow-btn" onClick={this.handleBorrow}>
                Borrow
              </button>
            ) : (
              <button className="borrow-btn disabled" disabled>
                Not Available
              </button>
            )}

          </div>

          <div className="detail-main-info">
            <p className="detail-cat">{book.category}</p>
            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">by {book.author}</p>

            <div className="rating-row">
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={star <= Math.round(book.rating) ? 'star filled' : 'star'}>
                    &#9733;
                  </span>
                ))}
              </div>
              <span className="rating-number">{book.rating}</span>
            </div>

            <p className="short-desc">{book.short_description}</p>

            <div className="book-meta-grid">
              <div className="meta-item">
                <p className="meta-label">Pages</p>
                <p className="meta-value">{book.pages}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Language</p>
                <p className="meta-value">{book.language}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Published</p>
                <p className="meta-value">{book.published_year}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Category</p>
                <p className="meta-value">{book.category}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">ISBN</p>
                <p className="meta-value">{book.isbn}</p>
              </div>
            </div>
          </div>

        </div>

        <div className="detail-bottom">
          <h2>About this book</h2>
          {book.description && book.description.split('\n').map((para, i) =>
            para.trim()
              ? <p key={i} className="long-desc-para">{para.trim()}</p>
              : null
          )}
        </div>

      </div>
    );
  }
}

export default withParams(BookDetail);