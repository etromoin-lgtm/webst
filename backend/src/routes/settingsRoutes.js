const express = require('express');
const router = express.Router();
const { getSiteSettings } = require('../controllers/settingsController');

// Public settings route
router.get('/', getSiteSettings);

module.exports = router;
