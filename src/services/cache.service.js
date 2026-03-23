/**
 * Cache Service - Redis-based caching
 */
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  async get(key) {
    return this.cache.get(key);
  }

  async set(key, value, ttl = 3600) {
    this.cache.set(key, value);
    setTimeout(() => this.cache.delete(key), ttl * 1000);
  }

  async del(key) {
    this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
  }
}

module.exports = new CacheService();
