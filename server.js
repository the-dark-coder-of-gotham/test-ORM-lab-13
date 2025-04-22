const express = require('express');
const app = express();
const { Book } = require('./models');
app.use(express.json());

app.get('/api/books', async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

app.get('/api/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) return res.json(book);
  res.status(404).json({ error: 'Book not found' });
});

app.post('/api/books', async (req, res) => {
  const { title, author, isbn, publication_year, genre } = req.body;
  if (!title || !author || !isbn) {
    return res.status(400).json({ error: 'Title, author, and ISBN are required.' });
  }

  try {
    const book = await Book.create({ title, author, isbn, publication_year, genre });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  const { title, author, isbn, publication_year, genre } = req.body;
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  try {
    await book.update({ title, author, isbn, publication_year, genre });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  await book.destroy();
  res.json({ message: 'Book deleted' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
