const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  borrowing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrowing',
    required: true,
  },
  pagesRead: {
    type: Number,
    default: 0,
  },
  totalPages: {
    type: Number,
    default: 100,
  },
  lastReadDate: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

progressSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
