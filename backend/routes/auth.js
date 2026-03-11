const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists with this email' });

    const user = await User.create({ name, email, password });

    // Create initial progress record
    await Progress.create({ userId: user._id });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
