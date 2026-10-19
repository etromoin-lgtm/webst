const express = require('express');
const router = express.Router();

const {
  registerClient,
  loginClient,
  getClientDashboard,
  createTicket,
  getTicketDetails,
  replyTicket,
  markMessageRead
} = require('../controllers/portalController');

const {
  getClientsList,
  getClientFullProfile,
  addProject,
  updateProject,
  deleteProject,
  addMilestone,
  addProductPurchase,
  addDocument,
  addInvoice,
  sendDirectMessage,
  reviewClaim
} = require('../controllers/portalAdminController');

// --- CLIENT AUTH & REGISTRATION ---
router.post('/register', registerClient);
router.post('/login', loginClient);

// --- CLIENT DASHBOARD DATA ---
router.get('/dashboard/:orgId', getClientDashboard);
router.post('/tickets', createTicket);
router.get('/tickets/:id', getTicketDetails);
router.post('/tickets/:id/reply', replyTicket);
router.post('/messages/:id/read', markMessageRead);

// --- ADMIN SIDE CLIENT MANAGEMENT ---
router.get('/admin/clients', getClientsList);
router.get('/admin/clients/:orgId', getClientFullProfile);
router.post('/admin/projects', addProject);
router.patch('/admin/projects/:id', updateProject);
router.delete('/admin/projects/:id', deleteProject);
router.post('/admin/milestones', addMilestone);
router.post('/admin/products', addProductPurchase);
router.post('/admin/documents', addDocument);
router.post('/admin/invoices', addInvoice);
router.post('/admin/messages', sendDirectMessage);
router.patch('/admin/claims/:id', reviewClaim);

module.exports = router;
