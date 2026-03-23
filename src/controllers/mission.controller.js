const missionService = require('../services/mission.service');

const missionController = {
  async getMissions(req, res) {
    const missions = await missionService.getUserMissions(req.user.id);
    res.json(missions);
  },
  async updateProgress(req, res) {
    const result = await missionService.updateProgress(req.user.id, req.params.id, req.body.progress);
    res.json(result);
  }
};
module.exports = missionController;
