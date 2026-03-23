const developerController = {
  async getApps(req, res) {
    res.json([]);
  },
  async createApp(req, res) {
    res.json({ success: true });
  }
};
module.exports = developerController;
