const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const errorMiddleware = require('./src/middleware/error.middleware');
const { startQueueManager } = require('./src/queue/queue.manager');
const logger = require('./src/utils/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorMiddleware);

// Database connection
connectDB();

// Start queue manager
startQueueManager();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
