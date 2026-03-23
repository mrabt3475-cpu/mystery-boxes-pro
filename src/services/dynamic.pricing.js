/**
 * dynamic.pricing.js
 *
 * Automatically adjusts box price based on demand.
 * Rule: price rises by 5% for every 20 opens in the last hour (max +50%).
 * Price resets toward base price when demand drops.
 */

const Box    = require('../models/Box');
const Order  = require('../models/Order');
const logger = require('../utils/logger');

const SURGE_STEP      = 0.05;   // +5% per surge level
const SURGE_THRESHOLD = 20;     // opens/hour to trigger one surge level
const MAX_SURGE       = 0.50;   // max +50% above base price
const PRICE_CACHE_TTL = 5 * 60 * 1000;

const priceCache = new Map();

/**
 * Get dynamic price for a box.
 */
async function getDynamicPrice(box) {
  const cached = priceCache.get(box._id.toString());
  if (cached && Date.now() - cached.calculatedAt < PRICE_CACHE_TTL) {
    return cached.price;
  }

  const since = new Date(Date.now() - 60 * 60 * 1000);
  const opensLastHour = await Order.countDocuments({
    box: box._id, createdAt: { $gte: since }
  });

  const surgeLevels = Math.floor(opensLastHour / SURGE_THRESHOLD);
  const surgeMultiplier = Math.min(surgeLevels * SURGE_STEP, MAX_SURGE);
  const dynamicPrice = parseFloat((box.price * (1 + surgeMultiplier)).toFixed(2));

  if (surgeMultiplier > 0) {
    logger.info(`[DynPrice] Box "${box.name}" surge +${(surgeMultiplier * 100).toFixed(0)}% → $${dynamicPrice} (${opensLastHour} opens/hr)`);
  }

  priceCache.set(box._id.toString(), { price: dynamicPrice, calculatedAt: Date.now() });
  return dynamicPrice;
}

/**
 * Get surge info for display
 */
async function getSurgeInfo(boxId) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const opensLastHour = await Order.countDocuments({ box: boxId, createdAt: { $gte: since } });
  const surgeLevels = Math.floor(opensLastHour / SURGE_THRESHOLD);
  const surgePercent = Math.min(surgeLevels * SURGE_STEP * 100, MAX_SURGE * 100);
  return {
    opensLastHour,
    isSurging: surgePercent > 0,
    surgePercent,
    label: surgePercent > 0 ? `🔥 +${surgePercent.toFixed(0)}% surge pricing` : null
  };
}

/**
 * Invalidate price cache for a box
 */
function invalidatePriceCache(boxId) {
  priceCache.delete(boxId.toString());
}

module.exports = { getDynamicPrice, getSurgeInfo, invalidatePriceCache };
