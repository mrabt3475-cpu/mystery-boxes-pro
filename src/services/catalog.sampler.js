/**
 * Catalog Sampler - Sample items for boxes
 */
const logger = require('../utils/logger');

class CatalogSampler {
  sampleItems(category, count, filters = {}) {
    // Sample random items from catalog
    return [];
  }

  calculateItemProbability(item, boxConfig) {
    return 1 / boxConfig.items.length;
  }

  ensureDiversity(items, maxSameCategory = 3) {
    return items;
  }
}

module.exports = new CatalogSampler();
