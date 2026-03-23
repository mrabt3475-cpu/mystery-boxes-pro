const catalogPipeline = {
  async process(item) {
    return item;
  },
  async transform(items) {
    return items;
  }
};
module.exports = catalogPipeline;
