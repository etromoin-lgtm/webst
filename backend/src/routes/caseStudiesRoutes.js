const express = require('express');
const router = express.Router();
const {
  getCaseStudies,
  getCaseStudyBySlug,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  duplicateCaseStudy,
  detectFaviconEndpoint
} = require('../controllers/caseStudiesController');

// Public endpoints
router.get('/', getCaseStudies);
router.get('/:slug', getCaseStudyBySlug);

// Favicon detection endpoint
router.post('/detect-favicon', detectFaviconEndpoint);

// Admin management endpoints
router.post('/', createCaseStudy);
router.put('/:id', updateCaseStudy);
router.delete('/:id', deleteCaseStudy);
router.post('/:id/duplicate', duplicateCaseStudy);

module.exports = router;
