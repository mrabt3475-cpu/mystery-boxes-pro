const express = require('express');
const router = express.Router();

router.get('/provably-fair', (req, res) => {
  res.json({ message: 'Provably Fair verification endpoint' });
});
router.post('/verify', (req, res) => {
  res.json({ verified: true });
});

module.exports = router;
