const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  issueDate: { 
    type: Date, 
    default: Date.now 
  },
  dueDate: { 
    type: Date, 
    default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) 
  },
  status: { 
    type: String, 
    enum: ['pending_borrow', 'borrowed', 'pending_return', 'returned', 'rejected'], 
    default: 'pending_borrow' 
  }
});


module.exports = mongoose.model('Loan', loanSchema);