const Box = require('../models/Box');
const Item = require('../models/Item');

const seedData = async () => {
  const items = await Item.insertMany([
    { name: 'Gift Card $10', value: 10, category: 'giftcard' },
    { name: 'Gift Card $25', value: 25, category: 'giftcard' },
    { name: 'Gift Card $50', value: 50, category: 'giftcard' }
  ]);
  
  await Box.create({
    name: 'Basic Box',
    price: 5,
    items: items.map(i => i._id)
  });
};

module.exports = seedData;
