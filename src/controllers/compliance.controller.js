const complianceService = require('../services/halal.service');

const complianceController = {
  async verifyOperation(req, res) {
    const result = complianceService.isCompliant(req.body.operation);
    res.json({ compliant: result });
  }
};
module.exports = complianceController;
