const express = require('express');
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Public: View all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Librarian & Admin only: Create a book
router.post('/', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Librarian & Admin only: Update a book
router.put('/:id', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Librarian & Admin only: Delete a book
router.delete('/:id', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;