const express = require('express');
const router = express.Router();
const { publicTrackBot } = require('../controllers/botController');

// Public beacon / tracking endpoint
router.post('/agent', publicTrackBot);
router.post('/bot', publicTrackBot);

module.exports = router;
