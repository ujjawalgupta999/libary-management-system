const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Admin Only: Create a new user (Student or Librarian)
router.post('/create', auth, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    
    res.status(201).json({ message: `${role} account created successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;