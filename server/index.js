require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');

const { User, Book, Borrow, Request } = require('./initDB');

const app = express();
app.use(cors({origin: ["http://deploy-test-xi.vercel.app", 
                       "https://deploy-test-git-main-siddhartha-singhs-projects-2044651b.vercel.app"]}));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;           //|| 'MY_SECRET_KEY'
// const MONGO_URI  = process.env.MONGO_URI  || 'mongodb://localhost:27017/librarydb';
const PORT       = process.env.PORT       || 5000;

// ─────────────────────────────────────
//  CONNECT TO MONGODB  
// ─────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.log('MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─────────────────────────────────────
//  AUTHENTICATE MIDDLEWARE
// ─────────────────────────────────────
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ error: 'Access Token Required' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Token missing' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send({ error: 'Invalid or Expired Token' });
  }
};

// ─────────────────────────────────────
//  ROOT
// ─────────────────────────────────────
app.get('/', (req, res) => res.send('Server is running'));

// ─────────────────────────────────────
//  AUTH
// ─────────────────────────────────────
app.post('/register', async (req, res) => {
  const { name, email, date, password, confirmPassword } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).send({ error: 'Email already Registered' });

    if (password !== confirmPassword)
      return res.status(400).send({ error: 'Both Passwords are different' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ name, email, date, password: hashedPassword });

    res.status(201).send({ message: 'User Registered Successfully', user_id: result._id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)       return res.status(401).send({ error: 'Email is Incorrect' });
    if (user.is_blocked) return res.status(403).send({ error: 'Your account has been blocked' });

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) return res.status(401).send({ error: 'Password is Incorrect' });

    const token = jwt.sign({ user_id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).send({
      message: 'Login Successfull',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  BOOKS
// ─────────────────────────────────────
app.get('/books', authenticateToken, async (req, res) => {
  try {
    const books = await Book.find();
    // Return id as numeric-style string — keep _id, frontend uses book.id
    res.send(books.map(b => ({ ...b.toObject(), id: b._id })));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/books/:id', authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send({ error: 'Book not found' });
    res.send({ ...book.toObject(), id: book._id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.post('/books', authenticateToken, async (req, res) => {
  const { title, author, category, description, short_description, book_url, cover_url, pages, language, published_year, isbn, total_copies } = req.body;
  try {
    await Book.create({ title, author, category, description, short_description, book_url, cover_url, pages, language, published_year, isbn, total_copies, available_copies: total_copies });
    res.status(201).send({ message: 'Book added successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/books/:id', authenticateToken, async (req, res) => {
  const { title, author, category, description, short_description, cover_url, pages, language, published_year, isbn, total_copies } = req.body;
  try {
    await Book.findByIdAndUpdate(req.params.id, { title, author, category, description, short_description, cover_url, pages, language, published_year, isbn, total_copies });
    res.send({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.delete('/books/:id', authenticateToken, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  FILTERED SEARCH
// ─────────────────────────────────────
app.get('/filtered', async (req, res) => {
  const { search2 } = req.query;
  try {
    const books = await Book.find({
      $or: [
        { title:  { $regex: search2, $options: 'i' } },
        { author: { $regex: search2, $options: 'i' } },
      ],
    });
    res.send(books.map(b => ({ ...b.toObject(), id: b._id })));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  USERS
// ─────────────────────────────────────
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role is_blocked created_at');
    res.send(users.map(u => ({ ...u.toObject(), id: u._id })));
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/users/:id/block', authenticateToken, async (req, res) => {
  const { is_blocked } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { is_blocked });
    res.send({ message: is_blocked ? 'User blocked' : 'User unblocked' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  PROFILE
// ─────────────────────────────────────
app.get('/profile/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'name email role created_at');
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.send({ ...user.toObject(), id: user._id });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/profile/:id', authenticateToken, async (req, res) => {
  const { name, email } = req.body;
  try {
    const existing = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existing) return res.status(400).send({ error: 'Email already taken' });

    const updated = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('name email role');
    res.send({ message: 'Profile updated successfully', user: { ...updated.toObject(), id: updated._id } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/profile/:id/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ error: 'User not found' });

    const passwordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!passwordCorrect) return res.status(400).send({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  REQUESTS
// ─────────────────────────────────────
app.post('/request', authenticateToken, async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    await Request.create({ user_id, book_id, request_date: new Date().toISOString().split('T')[0] });
    res.send('Request Initiated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/request', authenticateToken, async (req, res) => {
  try {
    const records = await Request.find()
      .populate('user_id', 'name email')
      .populate('book_id', 'title author')
      .sort({ created_at: -1 });

    const formatted = records.map(r => ({
      id:          r._id,
      user_name:   r.user_id?.name,
      email:       r.user_id?.email,
      title:       r.book_id?.title,
      author:      r.book_id?.author,
      status:      r.status,
      created_at:  r.created_at,
    }));
    res.send(formatted);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  BORROWS
// ─────────────────────────────────────
app.post('/borrows', authenticateToken, async (req, res) => {
  const { user_id, book_id } = req.body;
  try {
    const book = await Book.findById(book_id);
    if (!book)                    return res.status(404).send({ error: 'Book not found' });
    if (book.available_copies <= 0) return res.status(400).send({ error: 'No copies available' });

    const borrow_date = new Date().toISOString().split('T')[0];
    const due_date    = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    await Borrow.create({ user_id, book_id, borrow_date, due_date, status: 'borrowed' });
    await Book.findByIdAndUpdate(book_id, { $inc: { available_copies: -1 } });

    res.status(201).send({ message: 'Book borrowed successfully', due_date });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.put('/borrows/:id/return', authenticateToken, async (req, res) => {
  const return_date = new Date().toISOString().split('T')[0];
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) return res.status(404).send({ error: 'Record not found' });

    await Borrow.findByIdAndUpdate(req.params.id, { status: 'returned', return_date });
    await Book.findByIdAndUpdate(borrow.book_id, { $inc: { available_copies: 1 } });

    res.send({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/borrows', authenticateToken, async (req, res) => {
  try {
    const records = await Borrow.find()
      .populate('user_id', 'name email')
      .populate('book_id', 'title author')
      .sort({ created_at: -1 });

    const formatted = records.map(r => ({
      id:          r._id,
      user_name:   r.user_id?.name,
      email:       r.user_id?.email,
      title:       r.book_id?.title,
      author:      r.book_id?.author,
      borrow_date: r.borrow_date,
      due_date:    r.due_date,
      return_date: r.return_date,
      status:      r.status,
      created_at:  r.created_at,
    }));
    res.send(formatted);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get('/borrows/user/:user_id', authenticateToken, async (req, res) => {
  try {
    const records = await Borrow.find({ user_id: req.params.user_id })
      .populate('book_id', 'title author cover_url')
      .sort({ created_at: -1 });

    const formatted = records.map(r => ({
      id:          r._id,
      book_id:     r.book_id?._id,
      title:       r.book_id?.title,
      author:      r.book_id?.author,
      cover_url:   r.book_id?.cover_url,
      borrow_date: r.borrow_date,
      due_date:    r.due_date,
      return_date: r.return_date,
      status:      r.status,
      created_at:  r.created_at,
    }));
    res.send(formatted);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ─────────────────────────────────────
//  ADMIN STATS
// ─────────────────────────────────────
app.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const totalBooks    = await Book.countDocuments();
    const totalUsers    = await User.countDocuments({ role: 'user' });
    const activeBorrows = await Borrow.countDocuments({ status: 'borrowed' });
    const overdueBorrows = await Borrow.countDocuments({ status: 'overdue' });

    const recentBorrowDocs = await Borrow.find()
      .populate('user_id', 'name')
      .populate('book_id', 'title')
      .sort({ created_at: -1 })
      .limit(5);

    const recentBorrows = recentBorrowDocs.map(r => ({
      id:        r._id,
      user_name: r.user_id?.name,
      title:     r.book_id?.title,
      status:    r.status,
      due_date:  r.due_date,
    }));

    res.send({ totalBooks, totalUsers, activeBorrows, overdueBorrows, recentBorrows });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});
