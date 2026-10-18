const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'remarket_jwt_secret_dev_key_2026';

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // In MongoDB, find the user; if offline fallback, construct user from decoded payload
      if (req.app.locals.dbConnected) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'User belonging to this token no longer exists'
          });
        }
      } else {
        // Fallback user object from JWT payload
        req.user = {
          _id: decoded.id,
          name: decoded.name || 'Registered User',
          email: decoded.email || 'user@example.com',
          phone: decoded.phone || '',
          city: decoded.city || ''
        };
      }

      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token is invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided, please log in'
    });
  }
};

// Optional auth: attaches req.user if token is present, does not reject if missing
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (req.app.locals.dbConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = {
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email
        };
      }
    } catch {
      // Ignore token verification errors for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalAuth, JWT_SECRET };
