const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String },
  availableCopies: { type: Number, required: true, min: 0 },
  pdfUrl: { type: String },
  loanPeriodDays: { type: Number, default: 14 } // 🟢 New field for dynamic deadlines
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);