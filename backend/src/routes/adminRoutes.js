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
  getBookings,
  updateBooking,
  getStats
} = require('../controllers/adminController');

const { getAllBlogs, createBlog, deleteBlog } = require('../controllers/blogController');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getAllTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { getSeoSettings, updateSeoSettings, updateSiteSettings, getSiteSettings } = require('../controllers/settingsController');

const { loginRateLimiter } = require('../middleware/rateLimiter');

// Admin Auth
router.post('/login', loginRateLimiter, login);

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

// Bookings
router.get('/bookings', getBookings);
router.patch('/bookings/:id', updateBooking);

// Blogs
router.get('/blogs', getAllBlogs);
router.post('/blogs', createBlog);
router.delete('/blogs/:id', deleteBlog);

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

// Stats Overview
router.get('/stats', getStats);

module.exports = router;
