/**
 * Halal Service - Islamic compliance verification
 */
const logger = require('../utils/logger');
const islamicConfig = require('../config/islamic.config');

class HalalService {
  /**
   * Check if operation is compliant
   */
  isCompliant(operation) {
    const prohibited = islamicConfig.prohibited;
    return !prohibited.some(term => operation.toLowerCase().includes(term));
  }

  /**
   * Verify transaction is Halal
   */
  verifyTransaction(amount, type) {
    // Check for interest (riba)
    if (type === 'interest') {
      return { compliant: false, reason: 'Interest is prohibited' };
    }
    // Check amount limits
    if (amount > 10000) {
      return { compliant: false, reason: 'Amount exceeds limit' };
    }
    return { compliant: true };
  }

  /**
   * Calculate Zakat (2.5% annually)
   */
  calculateZakat(totalAssets) {
    return totalAssets * islamicConfig.zakatRate;
  }

  /**
   * Check user eligibility
   */
  async checkEligibility(user) {
    if (!user.isVerified) {
      return { eligible: false, reason: 'Email not verified' };
    }
    if (user.age < 18) {
      return { eligible: false, reason: 'Under 18 years old' };
    }
    return { eligible: true };
  }
}

module.exports = new HalalService();
