const express = require('express');
const { Borrowing, Book, Progress, User } = require('../models');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const existingBorrowing = await Borrowing.findOne({
      user: userId,
      book: bookId,
      status: 'Active'
    });

    if (existingBorrowing) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies < 1) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowing = await Borrowing.create({
      user: userId,
      book: bookId,
      dueDate
    });

    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    await Progress.create({
      borrowing: borrowing._id,
      pagesRead: 0,
      totalPages: 300
    });

    res.status(201).json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.put('/:id/return', protect, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.id);
    
    if (!borrowing) return res.status(404).json({ message: 'Borrowing not found' });
    
    if (borrowing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (borrowing.status === 'Returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    borrowing.status = 'Returned';
    borrowing.returnDate = new Date();
    await borrowing.save();

    const book = await Book.findById(borrowing.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json(borrowing);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/', protect, admin, async (req, res) => {
  try {
    const borrowings = await Borrowing.find()
      .populate('user', 'id name email')
      .populate('book', 'id title author');
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/overdue', protect, admin, async (req, res) => {
  try {
    const overdue = await Borrowing.find({
      status: 'Active',
      dueDate: { $lt: new Date() }
    })
      .populate('user', 'id name email')
      .populate('book', 'id title');
    res.json(overdue);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
