const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coverUrl: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalCopies: {
    type: Number,
    default: 1,
  },
  availableCopies: {
    type: Number,
    default: 1,
  },
  borrowCount: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// For mapping _id to id in frontend easily
bookSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
