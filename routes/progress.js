const express = require('express');
const { Progress, Borrowing } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { borrowingId, pagesRead } = req.body;
    
    const borrowing = await Borrowing.findById(borrowingId);
    if (!borrowing) return res.status(404).json({ message: 'Borrowing not found' });
    
    if (borrowing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let progress = await Progress.findOne({ borrowing: borrowingId });
    
    if (progress) {
      progress.pagesRead = pagesRead;
      progress.lastReadDate = new Date();
      await progress.save();
    } else {
      progress = await Progress.create({
        borrowing: borrowingId,
        pagesRead,
        lastReadDate: new Date()
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/:borrowingId', protect, async (req, res) => {
  try {
    const borrowing = await Borrowing.findById(req.params.borrowingId);
    if (!borrowing || (borrowing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const progress = await Progress.findOne({ borrowing: req.params.borrowingId });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/analytics/member/:id', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const borrowings = await Borrowing.find({ user: req.params.id }).populate('book');

    const analytics = await Promise.all(borrowings.map(async (b) => {
      const progress = await Progress.findOne({ borrowing: b._id });
      return {
        bookId: b.book._id,
        title: b.book.title,
        coverUrl: b.book.coverUrl,
        pagesRead: progress ? progress.pagesRead : 0,
        totalPages: progress ? progress.totalPages : 100,
        progressPercentage: progress ? Math.round((progress.pagesRead / progress.totalPages) * 100) : 0,
        lastReadDate: progress ? progress.lastReadDate : null
      };
    }));

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
