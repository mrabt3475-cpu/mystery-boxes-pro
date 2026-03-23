/**
 * Pricing Engine - Basic profit margin control
 */
const logger = require('../utils/logger');

class PricingEngine {
  constructor(options = {}) {
    this.minMargin = options.minMargin || 0.30; // 30% minimum margin
    this.maxMargin = options.maxMargin || 0.70;
  }

  calculatePrice(boxCost, targetMargin = null) {
    const margin = targetMargin || this.minMargin;
    const price = boxCost / (1 - margin);
    return Math.round(price * 100) / 100;
  }

  calculateProfit(boxPrice, boxCost) {
    return boxPrice - boxCost;
  }

  calculateMargin(boxPrice, boxCost) {
    return (boxPrice - boxCost) / boxPrice;
  }

  validatePricing(boxPrice, boxCost) {
    const margin = this.calculateMargin(boxPrice, boxCost);
    return margin >= this.minMargin;
  }
}

module.exports = PricingEngine;
