/**
 * pricing.engine.js
 *
 * Controls profit margin per box and calculates expected value (EV).
 * Golden Rule:  ExpectedValue <= Price * (1 - profitMargin)
 *
 * Default profit margin: 30%  (sustainable & safe)
 */

const DEFAULT_MARGIN = 0.30;

/**
 * Calculate the maximum allowed expected value for a box.
 * @param {number} price  - Box sale price in USD
 * @param {number} margin - Profit margin (0–1), default 0.30
 * @returns {number}        Max EV allowed
 */
function maxAllowedEV(price, margin = DEFAULT_MARGIN) {
  return parseFloat((price * (1 - margin)).toFixed(4));
}

/**
 * Given a list of items with baseValue and probability (0–100),
 * compute the actual expected value.
 * @param {Array} items  - [{ baseValue, probability }, ...]
 * @returns {number}       Computed EV
 */
function computeEV(items) {
  if (!items || items.length === 0) return 0;
  const totalProb = items.reduce((s, i) => s + (i.probability || 0), 0);
  const ev = items.reduce((sum, item) => {
    const weight = (item.probability || 0) / totalProb;
    return sum + weight * (item.baseValue || 0);
  }, 0);
  return parseFloat(ev.toFixed(4));
}

/**
 * Validate that a box's EV is within the allowed margin.
 * @param {number} price
 * @param {Array}  items
 * @param {number} margin
 * @returns {{ valid: boolean, ev: number, maxEV: number, margin: number }}
 */
function validateBoxPricing(price, items, margin = DEFAULT_MARGIN) {
  const ev    = computeEV(items);
  const maxEV = maxAllowedEV(price, margin);
  return {
    valid: ev <= maxEV,
    ev,
    maxEV,
    margin,
    profitPerOpen: parseFloat((price - ev).toFixed(4)),
    profitPercent: parseFloat(((price - ev) / price * 100).toFixed(2))
  };
}

/**
 * Project daily/monthly revenue based on box type.
 * @param {number} usersPerDay
 * @param {number} opensPerUser
 * @param {number} boxPrice
 * @param {number} margin
 */
function projectRevenue(usersPerDay, opensPerUser, boxPrice, margin = DEFAULT_MARGIN) {
  const dailyOpens   = usersPerDay * opensPerUser;
  const dailyRevenue = dailyOpens * boxPrice;
  const dailyProfit  = dailyRevenue * margin;
  return {
    dailyOpens,
    dailyRevenue: +dailyRevenue.toFixed(2),
    dailyProfit:  +dailyProfit.toFixed(2),
    monthlyRevenue: +(dailyRevenue * 30).toFixed(2),
    monthlyProfit:  +(dailyProfit  * 30).toFixed(2),
  };
}

/**
 * Suggest item probabilities so that computed EV hits target.
 * Useful for admins building new boxes.
 * Keeps legendary very rare, adjusts common probability.
 *
 * @param {number} targetEV   - Desired expected value (after margin)
 * @param {Array}  itemPool   - [{ name, baseValue, rarity }]
 * @returns {Array}             Same items with `probability` field added
 */
function suggestProbabilities(targetEV, itemPool) {
  const rarityWeights = {
    legendary: 0.5,
    epic:      2,
    rare:      8,
    uncommon:  25,
    common:    64.5
  };

  const total = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
  const items = itemPool.map(item => ({
    ...item,
    probability: parseFloat(((rarityWeights[item.rarity] || 10) / total * 100).toFixed(2))
  }));

  const currentEV = computeEV(items);
  const scaleFactor = currentEV > 0 ? targetEV / currentEV : 1;

  return items.map(item => ({
    ...item,
    probability: item.rarity === 'common'
      ? parseFloat((item.probability * scaleFactor).toFixed(2))
      : item.probability
  }));
}

module.exports = { maxAllowedEV, computeEV, validateBoxPricing, projectRevenue, suggestProbabilities, DEFAULT_MARGIN };
