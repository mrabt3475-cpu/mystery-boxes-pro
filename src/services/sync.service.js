/**
 * Sync Service - Catalog synchronization
 */
const logger = require('../utils/logger');

class SyncService {
  async syncAll() {
    logger.info('Starting full catalog sync');
    const results = [];
    // Sync from each provider
    results.push({ provider: 'kingdomlikes', items: 0 });
    results.push({ provider: 'g2a', items: 0 });
    results.push({ provider: 'cj', items: 0 });
    return results;
  }

  async syncProvider(providerName) {
    logger.info(`Syncing provider: ${providerName}`);
    return { success: true, items: 0 };
  }
}

module.exports = new SyncService();
