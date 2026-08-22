require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const userRoutes = require('./routes/userRoutes'); // THIS LINE MUST EXIST

const app = express();
app.use(cors());
app.use(express.json());

// Register Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes); // THIS LINE MUST EXIST

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

const cron = require('node-cron');
const Loan = require('./models/Loan');
const sendEmail = require('./utils/mailer');

// This cron job runs automatically every day at 08:00 AM
cron.schedule('0 8 * * *', async () => {
  try {
    const today = new Date();
    // Find all borrowed books where the due date is in the past
    const overdueLoans = await Loan.find({ status: 'borrowed', dueDate: { $lt: today } })
      .populate('userId', 'email name')
      .populate('bookId', 'title');

    overdueLoans.forEach(loan => {
      sendEmail(
        loan.userId.email,
        '⚠️ OVERDUE BOOK ALERT',
        `Hi ${loan.userId.name}, your copy of "${loan.bookId.title}" is overdue! Please return it immediately.`
      );
    });
  } catch (err) {
    console.error('Error running cron job:', err);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));