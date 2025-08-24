const express = require('express');
const { testConnection } = require('../config/database');

const router = express.Router();

// GET /health/db - simple database connectivity check
router.get('/db', async (req, res) => {
  try {
    await testConnection();
    res.json({ success: true, message: 'database connection ok' });
  } catch (error) {
    console.error('health db check failed:', error);
    res.status(500).json({ success: false, message: 'database connection failed', error: error && error.message });
  }
});

module.exports = router;
