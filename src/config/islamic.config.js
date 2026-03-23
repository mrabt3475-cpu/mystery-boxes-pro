/**
 * Islamic Compliance Configuration
 * Ensures all operations comply with Sharia principles
 */
module.exports = {
  // No interest (riba) - profit comes from service fees, not interest
  interestFree: true,
  
  // No gambling - games of chance are prohibited
  // This system uses skill-based rewards and fair pricing
  fairGaming: {
    provablyFair: true,
    noFixedOutcomes: true,
    transparentPricing: true
  },
  
  // Halal payment methods
  allowedPaymentMethods: [
    'binance_pay',
    'crypto_wallet',
    'bank_transfer'
  ],
  
  // Prohibited activities
  prohibited: {
    alcohol: true,
    pork: true,
    gambling: true,
    interest: true
  },
  
  // Profit margin (30% - covers costs + reasonable profit)
  profitMargin: 0.30,
  
  // Maximum bet limits for responsible gaming
  maxBetLimit: 100,
  dailyLimit: 500
};
