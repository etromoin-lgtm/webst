const express = require('express');
const router = express.Router();
const { getActiveTeam } = require('../controllers/teamController');

// Public team route
router.get('/', getActiveTeam);

module.exports = router;
