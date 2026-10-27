const express = require('express');
const router = express.Router();

const {
  login,
  getWebhooks,
  updateWebhooks,
  getApplications,
  updateApplication,
  deleteApplication,
  getContacts,
  updateContact,
  deleteContact,
  getBookings,
  updateBooking,
  getStats
} = require('../controllers/adminController');

const {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

const { getAllResources, createResource, deleteResource } = require('../controllers/resourceController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getAllTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { getSeoSettings, updateSeoSettings, updateSiteSettings, getSiteSettings } = require('../controllers/settingsController');
const { getBotLogs, getBotStats, simulateBotVisit, clearBotLogs } = require('../controllers/botController');

const { loginRateLimiter } = require('../middleware/rateLimiter');
const { requireAdminAuth } = require('../middleware/authMiddleware');

// Admin Auth (Public, rate-limited)
router.post('/login', loginRateLimiter, login);

// Protect all subsequent administrative routes
router.use(requireAdminAuth);

// Webhook config
router.get('/webhooks', getWebhooks);
router.post('/webhooks', updateWebhooks);

// Partner applications
router.get('/applications', getApplications);
router.patch('/applications/:id', updateApplication);
router.delete('/applications/:id', deleteApplication);

// Contacts
router.get('/contacts', getContacts);
router.patch('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

// Bookings
router.get('/bookings', getBookings);
router.patch('/bookings/:id', updateBooking);

// Blogs
router.get('/blogs', getAllBlogsAdmin);
router.post('/blogs', createBlog);
router.patch('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Resources
router.get('/resources', getAllResources);
router.post('/resources', createResource);
router.delete('/resources/:id', deleteResource);

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Team members
router.get('/team', getAllTeam);
router.post('/team', createTeamMember);
router.patch('/team/:id', updateTeamMember);
router.delete('/team/:id', deleteTeamMember);

// SEO Settings
router.get('/seo', getSeoSettings);
router.post('/seo', updateSeoSettings);

// Site Settings
router.get('/settings', getSiteSettings);
router.post('/settings', updateSiteSettings);

// AI Agents & Crawlers Intelligence
router.get('/bot-logs', getBotLogs);
router.get('/bot-stats', getBotStats);
router.post('/bot-simulate', simulateBotVisit);
router.delete('/bot-logs', clearBotLogs);

// Stats Overview
router.get('/stats', getStats);

module.exports = router;
