/**
 * Provably Fair - Cryptographic fairness verification
 */
const crypto = require('crypto');

class ProvablyFair {
  static generateServerSeed() {
    return crypto.randomBytes(32).toString('hex');
  }

  static calculateResult(serverSeed, clientSeed, nonce) {
    const hash = crypto.createHash('sha256');
    hash.update(serverSeed + clientSeed + nonce);
    return hash.digest('hex');
  }
}

module.exports = ProvablyFair;
