require('dotenv').config();
const mongoose = require('mongoose');
const { Book } = require('./initDB');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/librarydb';

const books = [
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    short_description: 'A novel about following your dreams and listening to your heart.',
    description: `The Alchemist follows the journey of Santiago, a young Andalusian shepherd boy who dreams of finding a treasure located near the Egyptian pyramids. His journey takes him across the Sahara desert, where he meets a series of people who help him understand the meaning of life and find his Personal Legend.

The story begins in Andalusia, Spain, where Santiago has a recurring dream about a treasure hidden near the Egyptian pyramids. He consults a Romani fortune-teller and an old king named Melchizedek, who tells him about the concept of a Personal Legend.

Santiago sells his flock of sheep and sets off for Egypt. Along the way he loses all his money, works for a crystal merchant to rebuild his savings, and eventually meets the alchemist himself who teaches him to listen to his heart.`,
    cover_url: 'https://davidegrogan.com/wp-content/uploads/2023/01/The-Alchemist-Cover-1024x585.png',
    book_url: 'https://m.media-amazon.com/images/I/617lxveUjYL.jpg',
    rating: 4.5,
    pages: 208,
    language: 'English',
    published_year: 1988,
    isbn: '978-0062315007',
    total_copies: 3,
    available_copies: 3,
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    short_description: 'A brief history of humankind from the Stone Age to the present.',
    description: `Sapiens traces the history of the human species from the emergence of Homo sapiens in Africa to the present day. Harari covers a sweeping range of human history, looking at how biology and history have defined humanity.

The book is divided into four major parts covering the Cognitive Revolution, the Agricultural Revolution, the unification of humankind, and the Scientific Revolution.

Throughout the book, Harari argues that the key to the success of Homo sapiens is our ability to believe in shared myths that allow large groups of strangers to cooperate together.`,
    cover_url: 'https://arunmani.in/library/sapiens/cover.webp',
    book_url: 'https://www.bradshawfoundation.com/books/books/sapiens.jpg',
    rating: 4.4,
    pages: 443,
    language: 'English',
    published_year: 2011,
    isbn: '978-0062316097',
    total_copies: 2,
    available_copies: 2,
  },
  {
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    short_description: 'A dystopian novel set in a totalitarian society ruled by Big Brother.',
    description: `1984 is George Orwell's terrifying vision of a totalitarian society. The story takes place in a fictional superstate called Oceania, ruled by a mysterious leader known as Big Brother.

The protagonist Winston Smith works for the Ministry of Truth, where his job is to rewrite historical records to match the ever-changing party line. Despite living under constant surveillance, Winston begins to question the regime.

The novel introduces concepts like Big Brother, doublethink, thoughtcrime, and Newspeak that remain frighteningly relevant today.`,
    cover_url: 'https://www.eourmart.com/cdn/shop/products/51OiP9ZQ1tL.jpg?v=1639834548&width=1445',
    book_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxsw9epxUkeTO2o_B18ng2fdNwYJ0hC3vBPQ&s',
    rating: 4.8,
    pages: 328,
    language: 'English',
    published_year: 1949,
    isbn: '978-0451524935',
    total_copies: 2,
    available_copies: 0,
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    category: 'Fiction',
    short_description: 'A science fiction epic set on the desert planet Arrakis.',
    description: `Dune is set in the distant future amidst a feudal interstellar society. The story follows Paul Atreides whose family accepts stewardship of the desert planet Arrakis, the only source of the most valuable substance in the universe.

Arrakis is a harsh, dry planet inhabited by the Fremen, a tough desert people. It is also home to giant sandworms and the precious spice melange, which extends life and makes space travel possible.

Paul must navigate political intrigue, betrayal, and survival in the desert as he slowly discovers his own extraordinary destiny among the Fremen people.`,
    cover_url: 'https://storage.googleapis.com/stateless-thedailyfandom-org/2021/12/0f12474b-header-dune-covers.jpg',
    book_url: 'https://lunabooks.in/cdn/shop/files/9781419731501.jpg?v=1772242906&width=675',
    rating: 4.6,
    pages: 412,
    language: 'English',
    published_year: 1965,
    isbn: '978-0441013593',
    total_copies: 3,
    available_copies: 3,
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    category: 'Science',
    short_description: 'A journey through the universe and how humans came to understand it.',
    description: `Cosmos is one of the bestselling science books of all time. In it, Carl Sagan explains the universe across thirteen illustrated chapters, covering topics from the origin of life to the nature of time.

Sagan discusses the history of astronomy and science, the lives of great scientists, the search for extraterrestrial intelligence, and the threat of nuclear war.

Written with both scientific rigor and poetic beauty, Cosmos remains one of the most accessible and inspiring introductions to science ever written.`,
    cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnOurBoBYrJkEh40qSeQb3cCsajAKyPeuhAQ&s',
    book_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSReROQglO6t5Iqsybuutz00qsamLydTw3tlxxYXhX3iA&s',
    rating: 4.9,
    pages: 365,
    language: 'English',
    published_year: 1980,
    isbn: '978-0345539434',
    total_copies: 2,
    available_copies: 2,
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    category: 'History',
    short_description: 'A memoir about a woman who grows up in a survivalist family and educates herself.',
    description: `Educated is the memoir of Tara Westover, who was born to survivalist parents in rural Idaho. She had no birth certificate until age nine and never attended school as a child.

Despite this, she educated herself enough to pass the ACT and gain admission to Brigham Young University. She went on to earn a PhD from Cambridge University.

The book is a powerful story about the struggle for self-invention and the importance of education in breaking free from the limitations imposed by family and circumstance.`,
    cover_url: 'https://i.ebayimg.com/images/g/FRkAAOSw12VnKr5E/s-l1200.jpg',
    book_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg7PQdvTWXdYi4dTR8KrWIym6qDKQ655KtGQ&s',
    rating: 4.6,
    pages: 334,
    language: 'English',
    published_year: 2018,
    isbn: '978-0399590504',
    total_copies: 2,
    available_copies: 0,
  },
];

const insertBooks = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await Book.countDocuments();
    if (count > 0) {
      console.log('Books already seeded. Skipping.');
      await mongoose.disconnect();
      return;
    }

    await Book.insertMany(books);
    console.log(`Inserted ${books.length} books successfully!`);

  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

insertBooks();