const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
    minlength: 1,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    minlength: 10,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
