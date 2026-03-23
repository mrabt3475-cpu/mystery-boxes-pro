/**
 * Auth Controller
 */
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

class AuthController {
  /**
   * Register new user
   */
  async register(req, res) {
    try {
      const { email, password, username, referralCode, telegramId } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: existingUser.email === email ? 'Email already registered' : 'Username already taken',
        });
      }

      // Validate referral code
      let referredBy = null;
      if (referralCode) {
        referredBy = await User.findOne({ referralCode });
        if (!referredBy) {
          return res.status(400).json({
            success: false,
            error: 'Invalid referral code',
          });
        }
      }

      // Create user
      const user = await User.create({
        email,
        password,
        username,
        referralCode: Math.random().toString(36).substring(2, 9).toUpperCase(),
        referredBy: referredBy?._id,
        telegramId,
        ipAddress: req.ip,
      });

      // Create wallet
      const wallet = await Wallet.create({ user: user._id });
      user.wallet = wallet._id;
      await user.save();

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      logger.info(`New user registered: ${user._id}`);

      res.status(201).json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
      });
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user with password
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account is disabled',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      logger.info(`User logged in: ${user._id}`);

      res.json({
        success: true,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
      });
    }
  }

  /**
   * Get current user
   */
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user.id).populate('wallet');
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user',
      });
    }
  }

  /**
   * Update profile
   */
  async updateProfile(req, res) {
    try {
      const allowedFields = ['username', 'telegramId', 'avatar', 'settings'];
      const updates = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true, runValidators: true }
      ).populate('wallet');

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
      });
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id).select('+password');

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password',
      });
    }
  }
}

module.exports = new AuthController();
