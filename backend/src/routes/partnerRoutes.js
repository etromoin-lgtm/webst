const express = require('express');
const router = express.Router();
const { applyPartner, getPartnerStatus } = require('../controllers/partnerController');

router.post('/apply', applyPartner);
router.get('/status/:code', getPartnerStatus);

module.exports = router;
