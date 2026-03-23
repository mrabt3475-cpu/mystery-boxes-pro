/**
 * Mystery Boxes Pro SDK
 */
class MysteryBoxSDK {
  constructor(apiKey, baseUrl = 'https://api.mysteryboxes.pro') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return response.json();
  }

  async getBoxes() {
    return this.request('/api/v1/boxes');
  }

  async openBox(boxId) {
    return this.request(`/api/v1/boxes/${boxId}/open`, {
      method: 'POST'
    });
  }

  async getBalance() {
    return this.request('/api/v1/wallet/balance');
  }

  async deposit(amount, method = 'crypto') {
    return this.request('/api/v1/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, method })
    });
  }
}

module.exports = MysteryBoxSDK;
