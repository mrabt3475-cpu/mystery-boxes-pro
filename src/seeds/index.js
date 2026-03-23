/**
 * Seeds - Initial data for the database
 */
const seedCatalog = require('./catalog.seed');

async function seed() {
  console.log('Seeding database...');
  await seedCatalog();
  console.log('Seeding complete!');
}

module.exports = seed;
