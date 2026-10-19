const express = require('express');
const router = express.Router();
const { upload, handleImageUpload } = require('../controllers/uploadController');

router.post('/', upload.single('image'), handleImageUpload);

module.exports = router;
