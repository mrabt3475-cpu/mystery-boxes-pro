/**
 * Pricing Engine V2 - Advanced breakdown of box pricing
 */
const logger = require('../utils/logger');

class PricingEngineV2 {
  constructor(options = {}) {
    this.baseMargin = options.baseMargin || 0.30;
    this.providerMarkup = options.providerMarkup || 0.15;
    this.platformFee = options.platformFee || 0.05;
  }

  calculateBoxPrice(itemCost, items, boxConfig) {
    const totalCost = itemCost * items.length;
    const providerCost = totalCost * (1 + this.providerMarkup);
    const platformFee = providerCost * this.platformFee;
    const basePrice = providerCost + platformFee;
    const targetProfit = basePrice * this.baseMargin;
    const finalPrice = basePrice + targetProfit;
    
    return {
      itemCost,
      providerCost,
      platformFee,
      basePrice,
      profit: targetProfit,
      finalPrice: Math.round(finalPrice * 100) / 100
    };
  }

  calculateEV(items, probabilities) {
    let ev = 0;
    for (let i = 0; i < items.length; i++) {
      ev += items[i].value * probabilities[i];
    }
    return ev;
  }

  validateEV(boxPrice, ev) {
    const maxEV = boxPrice * (1 - this.baseMargin);
    return ev <= maxEV;
  }
}

module.exports = PricingEngineV2;
