/**
 * Islamic Compliance Configuration
 * Configuration for Halal-compliant operations
 */
const islamicConfig = {
  // Halal operations allowed
  halalOperations: ['sale', 'exchange', 'gift'],
  
  // Prohibited activities
  prohibited: ['gambling', 'interest', 'alcohol', 'pork', 'pornography'],
  
  // Maximum Riba (interest) rate
  maxRiba: 0,
  
  // Zakat rate (2.5% annually)
  zakatRate: 0.025,
  
  // Enable compliance checks
  enforceCompliance: process.env.ENFORCE_ISLAMIC_COMPLIANCE === 'true',
  
  // Blocked countries/regions
  blockedRegions: [],
  
  // Required disclosures
  disclosures: {
    oddsDisplay: true,
    winLossReport: true,
    payoutGuarantee: false,
  },
  
  // Game rules
  gameRules: {
    noDebtGambling: true,
    requireAgeVerification: true,
    selfExclusionAvailable: true,
    lossLimitAvailable: true,
  },
  
  // Profit margin requirements
  profitMargin: {
    min: 0.30, // 30% minimum house edge
    max: 0.70, // 70% maximum house edge
  },
  
  // Payout rules
  payoutRules: {
    minPayout: 0,
    maxPayout: 10000,
    payoutTimeout: 72 * 60 * 60 * 1000, // 72 hours
  },
};

module.exports = islamicConfig;
