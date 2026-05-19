const express = require('express');
const { Book } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, genre, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) {
      query.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
    }

    const books = await Book.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 });
      
    const count = await Book.countDocuments(query);

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      books
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/top', async (req, res) => {
  try {
    const cacheKey = 'top_books';
    const cachedBooks = cache.get(cacheKey);
    if (cachedBooks) return res.json(cachedBooks);

    const books = await Book.find()
      .sort({ borrowCount: -1 })
      .limit(10);
    
    cache.set(cacheKey, books);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
