const express = require('express');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const { auth, authorize } = require('../middleware/auth');
const sendEmail = require('../utils/mailer'); 
const router = express.Router();

// 1. STUDENT: Request to borrow a book
router.post('/request-borrow', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // 🔴 NEW: Account Freeze Logic
    const overdueLoan = await Loan.findOne({ 
      userId: req.user.id, 
      status: 'borrowed',
      dueDate: { $lt: new Date() } 
    });
    
    if (overdueLoan) {
      return res.status(403).json({ message: 'Account frozen: You must return overdue items before borrowing new books.' });
    }

    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) return res.status(400).json({ message: 'Book is not available' });

    const existingLoan = await Loan.findOne({ 
      userId: req.user.id, 
      bookId: bookId, 
      status: { $in: ['pending_borrow', 'borrowed'] }
    });
    if (existingLoan) return res.status(400).json({ message: 'You already requested or hold this book' });

    const loan = new Loan({ userId: req.user.id, bookId: bookId, status: 'pending_borrow' });
    await loan.save();
    res.status(201).json({ message: 'Borrow request submitted successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. STUDENT: Get my loan history
router.get('/my-loans', auth, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id }).populate('bookId', 'title author');
    res.json(loans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. LIBRARIAN: Get all pending requests & active loans
router.get('/pending', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const pendingLoans = await Loan.find({ status: 'pending_borrow' }).populate('userId', 'name email').populate('bookId', 'title');
    res.json(pendingLoans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/active', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const activeLoans = await Loan.find({ status: 'borrowed' }).populate('userId', 'name email').populate('bookId', 'title');
    res.json(activeLoans);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. LIBRARIAN: Approve or reject a request
router.post('/approve', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const { loanId, action } = req.body; 
    const loan = await Loan.findById(loanId).populate('userId', 'email name').populate('bookId');
    if (!loan) return res.status(404).json({ message: 'Loan request not found' });

    if (action === 'approve') {
      if (loan.bookId.availableCopies <= 0) return res.status(400).json({ message: 'No copies left' });
      
      loan.bookId.availableCopies -= 1;
      await loan.bookId.save();
      
      loan.status = 'borrowed';
      loan.issueDate = Date.now();
      
      // 🟢 NEW: Dynamic Loan Calculation
      const periodDays = loan.bookId.loanPeriodDays || 14;
      loan.dueDate = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000); 
      await loan.save();

      if (loan.userId?.email) {
        sendEmail(loan.userId.email, 'Book Borrow Approved!', `Your request to borrow "${loan.bookId.title}" is approved. Due date: ${loan.dueDate.toDateString()}.`);
      }
      res.json({ message: 'Borrow request approved' });
    } else {
      loan.status = 'rejected';
      await loan.save();
      if (loan.userId?.email) {
        sendEmail(loan.userId.email, 'Book Request Rejected', `Your request to borrow "${loan.bookId.title}" was rejected.`);
      }
      res.json({ message: 'Borrow request rejected' });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. LIBRARIAN: Process Physical Return
router.post('/process-return', auth, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const { loanId } = req.body;
    const loan = await Loan.findById(loanId).populate('bookId');
    
    if (!loan || loan.status !== 'borrowed') return res.status(404).json({ message: 'Active loan not found' });

    loan.status = 'returned';
    loan.bookId.availableCopies += 1;
    await loan.bookId.save();
    await loan.save();

    res.json({ message: 'Book physically returned to library inventory.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;