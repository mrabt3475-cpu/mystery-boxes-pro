/**
 * Rate Limiter Middleware
 */
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded:', { ip: req.ip, url: req.originalUrl });
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later.',
    });
  },
});

// Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, error: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded:', { ip: req.ip });
    res.status(429).json({
      success: false,
      error: 'Too many auth attempts, please try again later.',
    });
  },
});

// Strict limiter for payment routes
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { success: false, error: 'Too many payment requests.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Payment rate limit exceeded:', { ip: req.ip });
    res.status(429).json({
      success: false,
      error: 'Too many payment requests.',
    });
  },
});

// Limiter for box opening (game action)
const boxOpenLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { success: false, error: 'Too many box openings, please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Box open rate limit exceeded:', { ip: req.ip, userId: req.user?.id });
    res.status(429).json({
      success: false,
      error: 'Too many box openings, please slow down.',
    });
  },
});

// Strict limiter for withdrawal
const withdrawalLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message: { success: false, error: 'Too many withdrawal requests.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Withdrawal rate limit exceeded:', { ip: req.ip, userId: req.user?.id });
    res.status(429).json({
      success: false,
      error: 'Too many withdrawal requests.',
    });
  },
});

// IP-based limiter for public routes
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, error: 'Too many requests from this IP.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter,
  boxOpenLimiter,
  withdrawalLimiter,
  publicLimiter,
};
