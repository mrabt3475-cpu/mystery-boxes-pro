/**
 * Validation Middleware
 */
const { validationResult, body, param, query } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Validate request body against schema
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg).join(', ');
    logger.warn('Validation error:', { errors: messages, path: req.path });
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }
  next();
};

/**
 * Common validation rules
 */
const commonRules = {
  email: () => body('email').isEmail().withMessage('Valid email is required'),
  password: () => body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  username: () => body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  phone: () => body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
  amount: () => body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be positive'),
  objectId: (field = 'id') => param(field).isMongoId().withMessage('Invalid ID format'),
  page: () => query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  limit: () => query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
};

/**
 * Sanitize input to prevent XSS
 */
const sanitize = (req, res, next) => {
  const sanitizeField = (value) => {
    if (typeof value === 'string') {
      return value.replace(/[<>"'&]/g, '');
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeField(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(sanitizeField);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  next();
};

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  validate,
  commonRules,
  sanitize,
  isValidObjectId,
  body,
  param,
  query,
};
