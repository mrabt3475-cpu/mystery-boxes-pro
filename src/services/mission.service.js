/**
 * Mission Service - Daily missions and rewards
 */
const MissionProgress = require('../models/MissionProgress');
const logger = require('../utils/logger');

class MissionService {
  async getUserMissions(userId) {
    return MissionProgress.find({ userId }).populate('missionId');
  }

  async updateProgress(userId, missionId, progress) {
    return MissionProgress.findOneAndUpdate(
      { userId, missionId },
      { $inc: { current: progress } },
      { upsert: true, new: true }
    );
  }

  async claimReward(userId, missionId) {
    // Claim reward logic
    return { claimed: true, reward: 0 };
  }
}

module.exports = new MissionService();
