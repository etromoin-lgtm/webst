const express = require('express');
const router = express.Router();
const { getBlogBySlug, getAllBlogs } = require('../controllers/blogController');

// Public blog routes
router.get('/', getAllBlogs);
router.get('/:slug', getBlogBySlug);

module.exports = router;
