const mongoose = require('mongoose');

// ─────────────────────────────────────
//  USER SCHEMA
// ─────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  date:       { type: String, required: true },
  role:       { type: String, default: 'user' },
  is_blocked: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at' } });

// ─────────────────────────────────────
//  BOOK SCHEMA
// ─────────────────────────────────────
const bookSchema = new mongoose.Schema({
  title:             { type: String, required: true },
  author:            { type: String, required: true },
  category:          { type: String, required: true },
  description:       { type: String },
  short_description: { type: String },
  cover_url:         { type: String },
  book_url:          { type: String },
  rating:            { type: Number, default: 0 },
  pages:             { type: Number },
  language:          { type: String, default: 'English' },
  published_year:    { type: Number },
  isbn:              { type: String },
  total_copies:      { type: Number, default: 1 },
  available_copies:  { type: Number, default: 1 },
}, { timestamps: { createdAt: 'created_at' } });

// ─────────────────────────────────────
//  BORROW SCHEMA
// ─────────────────────────────────────
const borrowSchema = new mongoose.Schema({
  user_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id:     { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrow_date: { type: String, required: true },
  due_date:    { type: String, required: true },
  return_date: { type: String, default: null },
  status:      { type: String, default: 'borrowed' }, // borrowed | returned | overdue
}, { timestamps: { createdAt: 'created_at' } });

// ─────────────────────────────────────
//  REQUEST SCHEMA
// ─────────────────────────────────────
const requestSchema = new mongoose.Schema({
  user_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  request_date: { type: String },
  status:       { type: String, default: 'requested' },
}, { timestamps: { createdAt: 'created_at' } });

const User    = mongoose.model('User',    userSchema);
const Book    = mongoose.model('Book',    bookSchema);
const Borrow  = mongoose.model('Borrow',  borrowSchema);
const Request = mongoose.model('Request', requestSchema);

module.exports = { User, Book, Borrow, Request };