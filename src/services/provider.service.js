/**
 * Provider Service - Manages product providers
 */
const Provider = require('../models/Provider');
const logger = require('../utils/logger');

class ProviderService {
  /**
   * Get active providers
   */
  async getActiveProviders() {
    return Provider.find({ active: true }).sort({ priority: -1 });
  }

  /**
   * Get provider by ID
   */
  async getProviderById(id) {
    return Provider.findById(id);
  }

  /**
   * Sync catalog from provider
   */
  async syncCatalog(providerId) {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    provider.syncStatus = 'syncing';
    await provider.save();

    try {
      logger.info(`Syncing catalog for provider: ${provider.name}`);
      // Provider-specific sync logic
      provider.lastSync = new Date();
      provider.syncStatus = 'success';
      await provider.save();
      return { synced: true, count: 0 };
    } catch (error) {
      provider.syncStatus = 'failed';
      await provider.save();
      throw error;
    }
  }

  /**
   * Calculate provider cost
   */
  async calculateProviderCost(providerId, itemPrice) {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }
    return itemPrice * (1 - provider.markup);
  }

  /**
   * Create provider
   */
  async createProvider(data) {
    const provider = await Provider.create(data);
    return provider;
  }

  /**
   * Update provider
   */
  async updateProvider(id, data) {
    const provider = await Provider.findByIdAndUpdate(id, data, { new: true });
    return provider;
  }
}

module.exports = new ProviderService();
