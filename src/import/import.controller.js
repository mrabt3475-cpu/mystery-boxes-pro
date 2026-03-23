const importController = {
  async importCJ(req, res) {
    res.json({ success: true, imported: 0 });
  },
  async importAliExpress(req, res) {
    res.json({ success: true, imported: 0 });
  },
  async importCatalog(req, res) {
    res.json({ success: true, imported: 0 });
  }
};
module.exports = importController;
