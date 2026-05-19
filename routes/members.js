const express = require('express');
const { User, Borrowing, Progress } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/:id/history', protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const history = await Borrowing.find({ user: req.params.id })
      .populate('book')
      .sort({ createdAt: -1 });

    // In Mongoose, getting the progress for each borrowing is a bit different
    // We map over history and fetch progress manually
    const historyWithProgress = await Promise.all(history.map(async (borrowing) => {
      const progress = await Progress.findOne({ borrowing: borrowing._id });
      return {
        ...borrowing.toObject(),
        id: borrowing._id.toHexString(), // Important for frontend
        Book: borrowing.book,
        Progress: progress
      };
    }));

    res.json(historyWithProgress);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
