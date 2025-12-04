const express = require('express');
const jwt = require('jsonwebtoken');
const Test = require('../models/Test');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Middleware to authenticate token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// GET tests
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'patient') {
      // Show tests for this patient
      const tests = await Test.find({ patient: req.user.id });
      res.json(tests);
    } else if (req.user.role === 'doctor') {
      // Show tests matching doctor's specialization
      const tests = await Test.find({ disease: req.user.specialization }).populate('patient', 'username');
      res.json(tests);
    } else {
      res.status(403).json({ message: 'Unauthorized role' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST test (Create)
router.post('/', authMiddleware, async (req, res) => {
  const { testName, disease } = req.body;
  try {
    // Find a doctor with matching specialization
    const User = require('../models/User');
    const doctor = await User.findOne({ role: 'doctor', specialization: disease });

    const newTest = new Test({
      testName,
      disease,
      patient: req.user.id,
      doctor: doctor ? doctor._id : null
    });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT test (Update - e.g., Doctor adds result)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE test
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ message: 'Test deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

