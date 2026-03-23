const User = require('../models/User');

const levelsController = {
  async getLevels(req, res) {
    res.json([{ level: 1, xp: 0 }, { level: 2, xp: 1000 }, { level: 3, xp: 5000 }]);
  },
  async getMyLevel(req, res) {
    const user = await User.findById(req.user.id);
    res.json({ level: user.level, xp: user.xp });
  }
};
module.exports = levelsController;
