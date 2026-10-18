const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, JWT_SECRET } = require('../middleware/auth');
const { getIsConnected } = require('../config/db');

// In-memory fallback user store when MongoDB is offline
let inMemoryUsers = [];

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ============================================================================
// 1. POST /api/auth/register
// Register a new user account
// ============================================================================
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, city } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and a password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      // Check if user already exists in MongoDB
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists'
        });
      }

      // Create new user (password is automatically hashed by pre-save hook)
      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone ? phone.trim() : '',
        city: city ? city.trim() : ''
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city
        }
      });
    }

    // Fallback in-memory registration
    const existingMem = inMemoryUsers.find(u => u.email === cleanEmail);
    if (existingMem) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const memUser = {
      _id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      city: city ? city.trim() : '',
      createdAt: new Date().toISOString()
    };
    inMemoryUsers.push(memUser);

    const token = generateToken(memUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        city: memUser.city
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 2. POST /api/auth/login
// Authenticate user & return token
// ============================================================================
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getIsConnected()) {
      // Find user in MongoDB
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city
        }
      });
    }

    // Fallback in-memory login
    const memUser = inMemoryUsers.find(u => u.email === cleanEmail);
    if (!memUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, memUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(memUser);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        city: memUser.city
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// 3. GET /api/auth/me
// Get current authenticated user profile
// ============================================================================
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = router;
