const antiFraud = {
  checkSuspicious(userId, amount) {
    return false;
  },
  validateTransaction(userId, amount) {
    return { valid: true };
  }
};

module.exports = antiFraud;
