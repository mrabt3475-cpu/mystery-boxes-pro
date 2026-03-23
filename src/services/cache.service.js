/**
 * Cache Service - In-memory caching
 */
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.cache = new Map();
    this.stats = { hits: 0, misses: 0 };
  }

  async get(key) {
    const item = this.cache.get(key);
    if (item) {
      if (item.expiry && item.expiry < Date.now()) {
        this.cache.delete(key);
        this.stats.misses++;
        return null;
      }
      this.stats.hits++;
      return item.value;
    }
    this.stats.misses++;
    return null;
  }

  async set(key, value, ttl = 3600) {
    this.cache.set(key, {
      value,
      expiry: ttl ? Date.now() + ttl * 1000 : null,
    });
  }

  async del(key) {
    this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
  }

  getStats() {
    return {
      size: this.cache.size,
      ...this.stats,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
    };
  }
}

module.exports = new CacheService();
