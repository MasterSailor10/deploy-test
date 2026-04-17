import React, { Component } from 'react';
import Navbar from '../components/NavBar';

import './BookCatalogue.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

class BookCatalogue extends Component {

  state = {
    books : [],
    bookSearch: '',
    authorSearch: '',
    category: 'All',
  };
  
  componentDidMount = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.get('https://library-management-system-velocity.onrender.com//books', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            this.setState({books : response.data})
        } catch (err) {
            console.log(err.message);
        }
    }

  handleBookSearch = (e) => {
    this.setState({ bookSearch: e.target.value });
  }

  handleAuthorSearch = (e) => {
    this.setState({ authorSearch: e.target.value });
  }

  handleCategory = (e) => {
    this.setState({ category: e.target.value });
  }

  handleAvailability = (e) => {
    const {available} = this.state
    this.setState({ available: e.target.value });
    console.log(available)
  }

  render() {
    const {books, bookSearch, authorSearch, category } = this.state;
    const filteredBooks = books.filter(b => {
      const matchTitle  = b.title.toLowerCase().includes(bookSearch.toLowerCase());
      const matchAuthor = b.author.toLowerCase().includes(authorSearch.toLowerCase());
      const matchCat    = category === 'All' || b.category === category;
      return matchTitle && matchAuthor && matchCat;
    });

    return (
      <div className="catalogue">
        <Navbar />
        <div className="catalogue-body">
          <div className="filters">
            <input
              type="text"
              placeholder="Search by book name"
              value={bookSearch}
              onChange={this.handleBookSearch}
            />
            <input
              type="text"
              placeholder="Search by author name"
              value={authorSearch}
              onChange={this.handleAuthorSearch}
            />
            <select value={category} onChange={this.handleCategory}>
              <option value="All">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
            </select>
          </div>

          <div className="book-grid">
            {filteredBooks.map(book => (
              <Link to={`/books/${book.id}`} className="book-link" key={book.id}>
                <div className="book-card">
                  <div className="book-cover">
                    <img src={book.cover_url} alt={book.title} />
                  </div>
                  <p className="book-title">{book.title}</p>
                  <p className="book-author">{book.author}</p>
                  <div className="card-footer">
                    <span className={`badge ${book.available_copies > 0 ? 'available' : 'borrowed'}`}>
                      {book.available_copies > 0 ? 'Available' : 'Not Available'}
                    </span>
                    <button className="view-btn">View</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default BookCatalogue;
