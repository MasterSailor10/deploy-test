import React, { Component } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import './ManageBooks.css';

class ManageBooks extends Component {

  state = {
    books: [],
    showForm: false,
    editId: null,
    title: '',
    author: '',
    category: '',
    pages: '',
    language: '',
    published_year: '',
    isbn: '',
    book_url: '',
    cover_url: '',
    short_description: '',
    description: '',
    total_copies: '',
    error: '',
    success: '',
    search1: '',
    search2: '',
    books2: [],
    backendBooks: false
  }

  // ─────────────────────────────────────
  //  API CALLS
  // ─────────────────────────────────────

  fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.setState({ books: response.data });
    } catch (err) {
      console.log(err);
    }
  }

  handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const {
      title, author, category, pages, language,
      published_year, isbn, book_url, cover_url,
      short_description, description, total_copies, editId
    } = this.state;

    // FIX: removed duplicate total_copies key
    const bookData = {
      title, author, category, pages, language,
      published_year, isbn, book_url, cover_url,
      short_description, description, total_copies
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/books/${editId}`, bookData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.setState({ success: 'Book updated!', error: '' });
      } else {
        await axios.post('http://localhost:5000/books', bookData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.setState({ success: 'Book added!', error: '' });
      }
      this.resetForm();
      await this.fetchBooks();
    } catch (err) {
      this.setState({ error: err.response?.data?.error || 'Something went wrong', success: '' });
    }
  }

  handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.setState({ success: 'Book deleted!', error: '' });
      await this.fetchBooks();
    } catch (err) {
      this.setState({ error: 'Error deleting book', success: '' });
    }
  }

  fetchBooksOnInput = async (search2) => {
    try {
      const response = await axios.get(`http://localhost:5000/filtered?search2=${search2}`);
      this.setState({ books2: response.data, backendBooks: true });
    } catch (err) {
      console.log(err);
    }
  }

  // ─────────────────────────────────────
  //  LIFECYCLE
  // ─────────────────────────────────────

  componentDidMount = async () => {
    await this.fetchBooks();
  }

  // ─────────────────────────────────────
  //  HANDLERS
  // ─────────────────────────────────────

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  // FIX: removed stale-state console.log (was logging value before setState)
  handleSearchAuthorAndBook = (e) => {
    this.setState({ search1: e.target.value, backendBooks: false });
  }

  // FIX: reset backendBooks to false when input is cleared
  handleSearchAuthorAndBook2 = (e) => {
    const value = e.target.value;
    this.setState({
      search2: value,
      backendBooks: value === '' ? false : this.state.backendBooks
    });
  }

  backendbtn = () => {
    const { search2 } = this.state;
    this.fetchBooksOnInput(search2);
  }

  handleEdit = (book) => {
    this.setState({
      showForm: true,
      editId: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      pages: book.pages,
      language: book.language,
      published_year: book.published_year,
      isbn: book.isbn,
      book_url: book.book_url,
      cover_url: book.cover_url,
      short_description: book.short_description,
      description: book.description,
      total_copies: book.total_copies
    });
  }

  resetForm = () => {
    this.setState({
      showForm: false,
      editId: null,
      title: '', author: '', category: '', pages: '',
      language: '', published_year: '', isbn: '', book_url: '', cover_url: '',
      short_description: '', description: '', total_copies: ''
    });
  }

  // ─────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────

  render() {
    const {
      search1, search2, books, books2, backendBooks,
      showForm, editId, title, author, category, pages,
      language, published_year, isbn, book_url, cover_url,
      short_description, description, total_copies, error, success
    } = this.state;

    // Frontend-filtered books (by title or author)
    const filteredBooks = books.filter(each => {
      const matchTitle  = each.title.toLowerCase().includes(search1.toLowerCase());
      const matchAuthor = each.author.toLowerCase().includes(search1.toLowerCase());
      return matchTitle || matchAuthor;
    });

    // FIX: use backend results when a backend search has been triggered, else frontend filter
    const displayBooks = backendBooks ? books2 : filteredBooks;

    return (
      <div className="admin-layout">
        <AdminSidebar />
        <div className="admin-body">

          <div className="admin-header">
            <h2>Manage Books</h2>
            <input
              value={search1}
              onChange={this.handleSearchAuthorAndBook}
              placeholder='Enter name and author (Frontend)'
            />
            <input
              value={search2}
              onChange={this.handleSearchAuthorAndBook2}
              placeholder='Enter name and author (Backend)'
            />
            <button className='add-btn' onClick={this.backendbtn}>Backend</button>
            <button className="add-btn" onClick={() => this.setState({ showForm: true, editId: null })}>
              + Add New Book
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          {showForm && (
            <div className="book-form-card">
              <h3>{editId ? 'Edit Book' : 'Add New Book'}</h3>
              <form onSubmit={this.handleAdd}>

                <div className="form-row">
                  <div>
                    <label>Title</label>
                    <input type="text" name="title" value={title} onChange={this.handleChange} placeholder="Book title" required />
                  </div>
                  <div>
                    <label>Author</label>
                    <input type="text" name="author" value={author} onChange={this.handleChange} placeholder="Author name" required />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Category</label>
                    <select name="category" value={category} onChange={this.handleChange} required>
                      <option value="">Select category</option>
                      <option value="Fiction">Fiction</option>
                      <option value="Science">Science</option>
                      <option value="History">History</option>
                    </select>
                  </div>
                  <div>
                    <label>Total Copies</label>
                    <input type="number" name="total_copies" value={total_copies} onChange={this.handleChange} placeholder="Number of copies" required />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Pages</label>
                    <input type="number" name="pages" value={pages} onChange={this.handleChange} placeholder="Number of pages" />
                  </div>
                  <div>
                    <label>Language</label>
                    <input type="text" name="language" value={language} onChange={this.handleChange} placeholder="English" />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Published Year</label>
                    <input type="number" name="published_year" value={published_year} onChange={this.handleChange} placeholder="2024" />
                  </div>
                  <div>
                    <label>ISBN</label>
                    <input type="text" name="isbn" value={isbn} onChange={this.handleChange} placeholder="978-..." />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Cover Image URL</label>
                    <input type="text" name="cover_url" value={cover_url} onChange={this.handleChange} placeholder="https://..." />
                  </div>
                  <div>
                    <label>Short Description</label>
                    <input type="text" name="short_description" value={short_description} onChange={this.handleChange} placeholder="One line description" />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Book Image URL</label>
                    <input type="text" name="book_url" value={book_url} onChange={this.handleChange} placeholder="https://..." />
                  </div>
                </div>

                <div className="form-full">
                  <label>Full Description</label>
                  <textarea name="description" value={description} onChange={this.handleChange} placeholder="Full description of the book" rows="4" />
                </div>

                <div className="form-btns">
                  <button type="submit">{editId ? 'Update Book' : 'Add Book'}</button>
                  <button type="button" className="cancel-btn" onClick={this.resetForm}>Cancel</button>
                </div>

              </form>
            </div>
          )}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* FIX: render displayBooks instead of filteredBooks so backend results show up */}
              {displayBooks.map(book => (
                <tr key={book.id}>
                  <td>
                    <img src={book.cover_url} alt={book.title} className="table-cover" />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>{book.total_copies}</td>
                  <td>{book.available_copies}</td>
                  <td>
                    <button className="edit-btn" onClick={() => this.handleEdit(book)}>Edit</button>
                    <button className="delete-btn" onClick={() => this.handleDelete(book.id)}>Delete</button>
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

export default ManageBooks;
