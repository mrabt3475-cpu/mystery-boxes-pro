/**
 * Dynamic Pricing - Adjusts based on demand
 */
const logger = require('../utils/logger');

class DynamicPricing {
  constructor(options = {}) {
    this.minMultiplier = options.minMultiplier || 0.8;
    this.maxMultiplier = options.maxMultiplier || 1.5;
    this.demandThreshold = options.demandThreshold || 100;
  }

  calculateMultiplier(salesVelocity, stockLevel) {
    const demandRatio = salesVelocity / this.demandThreshold;
    const scarcityRatio = this.demandThreshold / Math.max(stockLevel, 1);
    
    let multiplier = 1 + (demandRatio * 0.3) + (scarcityRatio * 0.2);
    multiplier = Math.max(this.minMultiplier, Math.min(this.maxMultiplier, multiplier));
    
    return Math.round(multiplier * 100) / 100;
  }

  adjustPrice(basePrice, multiplier) {
    return Math.round(basePrice * multiplier * 100) / 100;
  }
}

module.exports = DynamicPricing;
