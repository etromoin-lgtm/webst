const express = require('express');
const router = express.Router();
const { getAllResources, getResourceBySlug, createResource, deleteResource, getResourcePdf } = require('../controllers/resourceController');

// Public
router.get('/', getAllResources);
router.get('/:slug', getResourceBySlug);
router.get('/:slug/pdf', getResourcePdf);

// Admin (mounted under /api/admin/resources via adminRoutes ideally; here also expose)
router.post('/', createResource);
router.delete('/:id', deleteResource);

module.exports = router;
