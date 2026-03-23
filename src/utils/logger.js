/**
 * Logger Utility
 */
const logger = {
  info: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`, data || '');
  },
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`, error?.stack || error || '');
  },
  warn: (message, data) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`, data || '');
  },
  debug: (message, data) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG] ${timestamp} - ${message}`, data || '');
    }
  },
  http: (message, data) => {
    const timestamp = new Date().toISOString();
    console.log(`[HTTP] ${timestamp} - ${message}`, data || '');
  },
};

module.exports = logger;
