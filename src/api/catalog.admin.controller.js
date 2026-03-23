const catalogAdminController = {
  async getItems(req, res) {
    res.json([]);
  },
  async createItem(req, res) {
    res.json({ success: true });
  }
};
module.exports = catalogAdminController;
