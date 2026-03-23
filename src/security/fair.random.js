/**
 * Fair Random - Provably fair random generation
 */
const crypto = require('crypto');
const logger = require('../utils/logger');

class FairRandom {
  /**
   * Generate fair random number
   */
  generate(serverSeed, userSeed, max) {
    const hash = crypto
      .createHash('sha256')
      .update(serverSeed + userSeed)
      .digest('hex');
    
    const num = parseInt(hash.substring(0, 8), 16);
    return (num % max);
  }

  /**
   * Generate server seed
   */
  generateServerSeed() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate client seed
   */
  generateClientSeed() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Verify result
   */
  verify(serverSeed, userSeed, result, max) {
    const expected = this.generate(serverSeed, userSeed, max);
    return expected === result;
  }
}

module.exports = new FairRandom();
