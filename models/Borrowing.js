const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Active', 'Returned', 'Overdue'],
    default: 'Active',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

borrowingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);
module.exports = Borrowing;
