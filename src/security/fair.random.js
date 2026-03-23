const crypto = require('crypto');

class FairRandom {
  generate(serverSeed, userSeed) {
    const hash = crypto.createHash('sha256').update(serverSeed + userSeed).digest('hex');
    return parseInt(hash.substring(0, 8), 16) / 0xffffffff;
  }
}

module.exports = new FairRandom();
