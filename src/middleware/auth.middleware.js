/**
 * Auth Middleware - Handle authentication and authorization
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and attach user to request
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        error: 'Account is disabled' 
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};

/**
 * Optional auth - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

/**
 * Check if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }
  next();
};

/**
 * Check if user is developer
 */
const requireDeveloper = (req, res, next) => {
  if (!req.user || !['admin', 'developer'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      error: 'Developer access required' 
    });
  }
  next();
};

/**
 * Check if user has specific role
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `Required role: ${roles.join(' or ')}` 
      });
    }
    next();
  };
};

/**
 * Check if user has required level
 */
const requireLevel = (minLevel) => {
  return (req, res, next) => {
    if (!req.user || req.user.level < minLevel) {
      return res.status(403).json({ 
        success: false, 
        error: `Required level: ${minLevel}` 
      });
    }
    next();
  };
};

/**
 * Generate JWT token
 */
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' });
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireAdmin,
  requireDeveloper,
  requireRole,
  requireLevel,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  JWT_SECRET,
};
