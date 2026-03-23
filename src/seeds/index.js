const seedCatalog = require('./catalog.seed');

const runSeeds = async () => {
  console.log('Running seeds...');
  await seedCatalog();
  console.log('Seeds completed');
};

module.exports = runSeeds;
