/**
 * Halal Service - Islamic compliance verification
 */
const logger = require('../utils/logger');

class HalalService {
  isCompliant(operation) {
    const nonCompliant = ['gambling', 'interest', 'alcohol', 'pork'];
    return !nonCompliant.some(term => operation.toLowerCase().includes(term));
  }

  verifyTransaction(amount, type) {
    if (type === 'interest') return { compliant: false, reason: 'Interest not allowed' };
    return { compliant: true };
  }

  calculateZakat(totalAssets) {
    return totalAssets * 0.025; // 2.5% annual Zakat
  }
}

module.exports = new HalalService();
