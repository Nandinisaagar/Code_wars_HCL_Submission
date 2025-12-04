const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

router.post('/signup', async (req, res) => {
  const { username, password, role, specialization } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      password: hashedPassword, 
      role, 
      specialization: role === 'doctor' ? specialization : undefined
    });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, specialization: user.specialization }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, specialization: user.specialization });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

