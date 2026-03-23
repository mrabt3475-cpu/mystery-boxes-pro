const crypto = require('crypto');

const secureRNG = {
  generateSeed() {
    return crypto.randomBytes(32).toString('hex');
  },
  generateHash(seed) {
    return crypto.createHash('sha256').update(seed).digest('hex');
  },
  verify(seed, hash) {
    return this.generateHash(seed) === hash;
  }
};

module.exports = secureRNG;
