const ProvablyFair = require('../security/provably.fair');

const provablyFairRoutes = (req, res) => {
  res.json({ message: 'Provably Fair endpoint' });
};

module.exports = provablyFairRoutes;
