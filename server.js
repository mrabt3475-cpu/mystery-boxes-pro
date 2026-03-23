const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mysteryboxes')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/v1/auth', require('./src/routes/auth.routes'));
app.use('/api/v1/boxes', require('./src/routes/box.routes'));
app.use('/api/v1/wallet', require('./src/routes/wallet.routes'));
app.use('/api/v1/orders', require('./src/routes/order.routes'));
app.use('/api/v1/referrals', require('./src/routes/referral.routes'));
app.use('/api/v1/admin', require('./src/routes/admin.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;