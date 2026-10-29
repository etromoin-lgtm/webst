const express = require('express');
const router = express.Router();
const { getSiteSettings, getSeoSettings } = require('../controllers/settingsController');

// Public settings route
router.get('/', getSiteSettings);
router.get('/seo', getSeoSettings);

module.exports = router;
