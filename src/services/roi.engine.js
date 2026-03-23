/**
 * ROI Engine - Calculate return on investment
 */
const logger = require('../utils/logger');

class ROIEngine {
  calculateROI(spent, won) {
    if (spent === 0) return 0;
    return ((won - spent) / spent) * 100;
  }

  calculateExpectedROI(boxConfig) {
    const totalValue = boxConfig.items.reduce((sum, item) => sum + item.value, 0);
    const avgValue = totalValue / boxConfig.items.length;
    const expectedReturn = avgValue * 0.7; // 70% expected return
    return ((expectedReturn - boxConfig.price) / boxConfig.price) * 100;
  }
}

module.exports = new ROIEngine();
