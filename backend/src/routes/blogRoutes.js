const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getFeaturedBlogs,
  getRelatedBlogs,
  getBlogBySlug,
  getBlogPdf
} = require('../controllers/blogController');

// Public blog routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug/related', getRelatedBlogs);
router.get('/:slug/pdf', getBlogPdf);
router.get('/:slug', getBlogBySlug);

module.exports = router;
