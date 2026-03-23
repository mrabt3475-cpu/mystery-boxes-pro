/**
 * Validators Utility
 */
const validators = {
  /**
   * Validate email
   */
  isEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
   */
  isStrongPassword: (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validate username (alphanumeric, 3-20 chars)
   */
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },

  /**
   * Validate phone number
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  },

  /**
   * Validate amount
   */
  isValidAmount: (amount, min = 0, max = Infinity) => {
    const num = parseFloat(amount);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * Validate MongoDB ObjectId
   */
  isObjectId: (id) => {
    const mongoose = require('mongoose');
    return mongoose.Types.ObjectId.isValid(id);
  },

  /**
   * Sanitize string (remove dangerous characters)
   */
  sanitize: (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>"'&]/g, '');
  },
};

module.exports = validators;
